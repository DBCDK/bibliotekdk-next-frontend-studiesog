import React, { act } from "react";
import { createRoot } from "react-dom/client";
import BookmarkDropdown from "../BookmarkDropdown";
import useBookmarks from "@/components/hooks/useBookmarks";

jest.mock("@/components/hooks/useBookmarks", () => ({
  ...jest.requireActual("@/components/hooks/useBookmarks"),
  __esModule: true,
  default: jest.fn(),
}));
jest.mock(
  "@/components/base/bookmark/Bookmark",
  () =>
    function Bookmark({ selected, onClick }) {
      return (
        <button aria-pressed={selected} onClick={onClick}>
          Husk
        </button>
      );
    }
);
jest.mock("@/public/icons/bookmark_small.svg", () => "svg");

test.each([
  ["whole work", null, ["BOOK"], true],
  ["general selection", { general: ["BOOKS"] }, ["BOOK"], true],
  ["specific selection", { specific: ["BOOK"] }, ["BOOK"], true],
  [
    "different compound selection",
    { specific: ["BOOK"] },
    ["BOOK", "SOUND_RECORDING_CD"],
    false,
  ],
])(
  "%s selects and toggles only the matching bookmark",
  async (_, selection, codes, selected) => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    const container = document.createElement("div");
    const root = createRoot(container);
    const setBookmark = jest.fn();
    const workId = "work-of:test";
    useBookmarks.mockReturnValue({
      bookmarks: [
        {
          id: "bookmark-uuid",
          key: "bookmark-uuid",
          materialId: workId,
          workId,
          selection: selection && { materialTypes: selection },
        },
      ],
      setBookmark,
      isLoading: false,
    });
    try {
      await act(async () =>
        root.render(
          <BookmarkDropdown
            workId={workId}
            materialTypes={[
              codes.map((specificCode) => ({
                specificCode,
                specificDisplay: specificCode,
                generalCode: "BOOKS",
              })),
            ]}
          />
        )
      );
      const button = container.querySelector("button");
      expect(button.getAttribute("aria-pressed")).toBe(String(selected));
      await act(async () => button.click());
      expect(setBookmark).toHaveBeenCalledWith(
        expect.objectContaining({
          materialId: workId,
          key: selected ? "bookmark-uuid" : undefined,
        })
      );
    } finally {
      await act(async () => root.unmount());
    }
  }
);
