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
