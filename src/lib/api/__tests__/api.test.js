import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { fetcher, generateKey } from "../api";
import { fetchAll } from "../bookmarks.fragments";
import { addBookmarks, deleteBookmarks } from "../bookmarks.mutations";
import * as complexSearch from "../complexSearch.fragments";
import { all as search } from "../search.fragments";
import { csSuggest } from "../suggest.fragments";
import { idsToWorks } from "../work.fragments";

jest.mock("isomorphic-unfetch", () => jest.fn());
jest.mock("next/config", () =>
  jest.fn().mockReturnValue({
    publicRuntimeConfig: {
      fbi_api: {
        origin: "https://fbi-api.dbc.dk",
        presentProfile: "present-test",
        searchProfile: "search-test",
      },
    },
  })
);
jest.mock("@/components/hooks/user/useAccessToken", () => jest.fn());
jest.mock("@/components/hooks/useCookieConsent", () => jest.fn());
jest.mock("@/components/hooks/useSubDomainToBrancId", () => ({}));

beforeEach(() => {
  fetch.mockReset();
  fetch.mockResolvedValue({ status: 200, json: async () => ({ data: {} }) });
});

test.each([
  [
    "https://fbi-api.dbc.dk",
    undefined,
    "present",
    "https://fbi-api.dbc.dk/present-test/graphql",
  ],
  [
    "https://fbi-api.dbc.dk",
    "872600",
    undefined,
    "https://fbi-api.dbc.dk/872600/search-test/graphql",
  ],
  [
    "http://localhost:3000/",
    "872600",
    "search",
    "http://localhost:3000/872600/search-test/graphql",
  ],
  [
    "https://fbi-api.dbc.dk",
    undefined,
    "search",
    "https://fbi-api.dbc.dk/search-test/graphql",
  ],
  [
    "http://localhost:3000",
    undefined,
    undefined,
    "http://localhost:3000/search-test/graphql",
  ],
])(
  "routes %s with branch %s and profile %s",
  async (origin, branchId, profile, url) => {
    getConfig().publicRuntimeConfig.fbi_api.origin = origin;
    const operation = {
      query: "query { __typename }",
      variables: {},
      profile,
    };
    await fetcher(generateKey(operation), null, null, { branchId });
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ query: operation.query, variables: {} }),
      })
    );
  }
);

test.each([
  ["list", fetchAll({ withMaterial: true })],
  ["count", fetchAll({ countOnly: true })],
  ["work filter", fetchAll({ workId: "work-of:test" })],
  ["add", addBookmarks({ bookmarks: [{ materialId: "work-of:test" }] })],
  ["delete", deleteBookmarks({ bookmarkIds: ["bookmark-uuid"] })],
  ["work page", idsToWorks({ ids: ["work-of:test"] })],
  ["ordinary search", search({ q: "test" })],
  ["complex suggestions", csSuggest({ q: "test", type: "title" })],
])("%s uses the default search profile", async (_, operation) => {
  getConfig().publicRuntimeConfig.fbi_api.origin = "https://fbi-api.dbc.dk";
  await fetcher(operation);
  expect(fetch.mock.calls[0][0]).toBe(
    "https://fbi-api.dbc.dk/search-test/graphql"
  );
});

test("cache keys distinguish profiles and normalize the default", () => {
  const query = { query: "query { __typename }" };
  expect(generateKey(query)).toBe(generateKey({ ...query, profile: "search" }));
  expect(generateKey(query)).not.toBe(
    generateKey({ ...query, profile: "present" })
  );
});

test("a failed alternate profile request is not retried with the default profile", async () => {
  fetch.mockResolvedValue({ status: 503, statusText: "Unavailable" });
  await expect(
    fetcher({ ...fetchAll({ withMaterial: true }), profile: "present" })
  ).rejects.toMatchObject({ status: 503 });
  expect(fetch).toHaveBeenCalledTimes(1);
});

test.each(Object.entries(complexSearch))(
  "%s uses the search profile, including facets and filters",
  async (_, createOperation) => {
    getConfig().publicRuntimeConfig.fbi_api.origin = "https://fbi-api.dbc.dk";
    await fetcher(createOperation({ cql: "test", offset: 0, limit: 25 }));
    expect(fetch.mock.calls[0][0]).toBe(
      "https://fbi-api.dbc.dk/search-test/graphql"
    );
  }
);

test("cache keys change when the configured profile name changes", () => {
  const query = { query: "query { __typename }" };
  const config = getConfig().publicRuntimeConfig.fbi_api;
  const before = generateKey(query);
  config.searchProfile = "other-search";
  try {
    expect(generateKey(query)).not.toBe(before);
  } finally {
    config.searchProfile = "search-test";
  }
});
