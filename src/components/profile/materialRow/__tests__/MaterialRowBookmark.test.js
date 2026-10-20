import React, { act } from "react";
import { createRoot } from "react-dom/client";
import MaterialRowBookmark from "../versions/MaterialRowBookmark";

jest.mock(
  "@/components/work/reservationbutton/ReservationButton",
  () =>
    function ReservationButton() {
      return <button data-testid="order">Bestil</button>;
    }
);

test("missing materials retain distinct row identities and deletion, with no ordering or work link", async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  const remove = jest.fn();
  try {
    await act(async () =>
      root.render(
        <>
          {["first-uuid", "second-uuid"].map((id) => (
            <MaterialRowBookmark
              key={id}
              bookmarkKey={id}
              materialId="work-of:missing"
              workId="work-of:missing"
              title="Gemt titel"
              creator="Gemt ophav"
              hasCheckbox
              hasMaterial={false}
              allManifestations={[]}
              onBookmarkDelete={() => remove(id)}
            />
          ))}
        </>
      )
    );
    expect(container.textContent).toContain("Gemt titel");
    expect(container.textContent).toContain("Gemt ophav");
    expect(container.querySelector("[data-testid=order]")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
    const checkboxes = [...container.querySelectorAll("input")];
    expect(checkboxes).toHaveLength(2);
    expect(new Set(checkboxes.map((input) => input.id)).size).toBe(2);
    await act(async () => container.querySelector("button").click());
    expect(remove).toHaveBeenCalledWith("first-uuid");
  } finally {
    await act(async () => root.unmount());
  }
});

test.each([true, false])(
  "resolved material links and orders only when available in search (%s)",
  async (available) => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    const container = document.createElement("div");
    const root = createRoot(container);
    const remove = jest.fn();
    try {
      await act(async () =>
        root.render(
          <MaterialRowBookmark
            bookmarkKey="uuid"
            workId="work-of:test"
            title="En bog"
            titles={{ main: ["En bog"] }}
            creators={[]}
            hasMaterial
            isAvailableInSearchProfile={available}
            allManifestations={[
              { pid: "870970-basis:test", materialTypes: [] },
            ]}
            onBookmarkDelete={remove}
          />
        )
      );
      expect(!!container.querySelector("a")).toBe(available);
      expect(!!container.querySelector("[data-testid=order]")).toBe(available);
      await act(async () =>
        container.querySelector('[data-control="ICON-BUTTON"]').click()
      );
      expect(remove).toHaveBeenCalledTimes(1);
    } finally {
      await act(async () => root.unmount());
    }
  }
);

test.each([
  ["STUDIEBIB", "872600", "Eget bibliotek", "Studiebib"],
  ["BIBLIOTEKDK", "872600", "Eget bibliotek", "bibliotek.dk"],
  ["STUDIESOEG", "874260", "Greve", "Greve"],
  ["STUDIESOEG", "872600", "Eget bibliotek", null],
  ["FUTURE_APP", "874260", "Greve", "Greve"],
  [undefined, "874260", "Greve", "Greve"],
  [undefined, "872600", "Eget bibliotek", null],
  ["FUTURE_APP", "874260", undefined, null],
  [undefined, undefined, undefined, null],
])("bookmark source for %s / %s", async (application, id, name, expected) => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(async () =>
      root.render(
        <MaterialRowBookmark
          title="En bog"
          application={application}
          agency={{ id, name }}
          siteAgencyId="872600"
        />
      )
    );
    const source = container.querySelector(".bookmarkSource");
    if (expected) {
      expect(source.textContent).toBe(`Tilføjet fra ${expected}`);
    } else {
      expect(source).toBeNull();
    }
  } finally {
    await act(async () => root.unmount());
  }
});

test("missing cover loses its fixed fallback height when an image arrives", async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(async () => root.render(<MaterialRowBookmark title="En bog" />));
    expect(
      container
        .querySelector('[data-cy="missing-cover"]')
        .classList.contains("bookmarkMissingCover")
    ).toBe(true);
    await act(async () =>
      root.render(<MaterialRowBookmark title="En bog" image="/cover.jpg" />)
    );
    expect(container.querySelector('[data-cy="cover-present"]')).not.toBeNull();
    expect(container.querySelector(".bookmarkMissingCover")).toBeNull();
  } finally {
    await act(async () => root.unmount());
  }
});
