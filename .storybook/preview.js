/**
 * @file This is loaded in the "preview" iframe
 * https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */
import "lazysizes";
import config from "@/config";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "../src/scss/custom-bootstrap.scss";
import "../src/css/styles.css";

import { Provider as ModalContextProvider } from "../src/components/_modal/Modal.js";
import { GraphQLMocker } from "@/lib/api/mockedFetcher";
import { StoryRouter } from "@/components/base/storybook";
import { getRouter } from "@storybook/nextjs/router.mock";
import { SessionProvider } from "next-auth/react";
import { createMemoryRouter, useMemoryRouter } from "./nextMemoryRouter";
import AdvancedSearchProvider from "@/components/search/advancedSearch/advancedSearchContext";
import { UseManyProvider } from "@/components/hooks/useMany";

const memoryRouter = createMemoryRouter();

export const decorators = [
  (Story, context) => {
    const { showInfo, pathname, query } = context?.parameters?.nextRouter || {};

    // Register to router changes
    // Will trigger rerender when change occurs
    useMemoryRouter({ memoryRouter, pathname, query });
    // Storybook 8 copies router parameters before our memory router is reset.
    Object.assign(getRouter(), memoryRouter);

    return (
      <>
        {showInfo && <StoryRouter router={memoryRouter} />}
        <Story />
        <UseManyProvider />
      </>
    );
  },
  (Story) => {
    return (
      <AdvancedSearchProvider router={memoryRouter}>
        <Story />
      </AdvancedSearchProvider>
    );
  },
  (Story, context) => {
    return (
      <SessionProvider
        session={
          context?.parameters?.session
            ? { accessToken: "dummy-token", ...context?.parameters?.session }
            : {
                accessToken: "dummy-token",
                user: {
                  uniqueId: "mocked-uniqueId",
                  userId: "mocked-uniqueId",
                },
              }
        }
      >
        <Story />
      </SessionProvider>
    );
  },
  (Story) => {
    return (
      <ModalContextProvider router={memoryRouter}>
        <Story />
      </ModalContextProvider>
    );
  },
  (Story, context) => {
    return (
      <GraphQLMocker
        url={
          context?.parameters?.graphql?.url ||
          new URL(
            `/${config.fbi_api.searchProfile}/graphql`,
            config.fbi_api.origin
          ).href
        }
        resolvers={context?.parameters?.graphql?.resolvers}
        beforeFetch={context?.parameters?.graphql?.urlbeforeFetch}
        debug={context?.parameters?.graphql?.debug}
      >
        <Story />
      </GraphQLMocker>
    );
  },
];

// Setup router via storybook nextjs framework
export const parameters = {
  nextjs: {
    router: memoryRouter,
  },
};
