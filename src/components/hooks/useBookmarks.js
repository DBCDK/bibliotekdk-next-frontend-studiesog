import useSWR from "swr";
import * as workFragments from "@/lib/api/work.fragments";
import { useData, useMutate } from "@/lib/api/api";
import { useEffect } from "react";
import * as bookmarkMutations from "@/lib/api/bookmarks.mutations";
import * as bookmarkFragments from "@/lib/api/bookmarks.fragments";
import { useSession } from "next-auth/react";

const KEY_NAME = "bookmarks";

export const BookmarkSyncProvider = () => {
  const { syncCookieBookmarks } = useBookmarks();
  const { data: session } = useSession();

  useEffect(async () => {
    const isAuthenticated = !!session?.user?.uniqueId;
    if (isAuthenticated) {
      await syncCookieBookmarks();
    }
  }, [session]);

  return <></>;
};

export default function useBookmarks() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user?.uniqueId;

  let {
    data: localBookmarks,
    mutate: mutateLocalBookmarks,
    error,
  } = useSWR(KEY_NAME, (key) => JSON.parse(localStorage.getItem(key)) || []);
  const {
    data: globalBookmarksUserObject,
    isLoading: isLoadingGlobalBookmarks,
    error: globalBookmarksError,
    mutate: mutateGlobalBookmarks,
  } = useData(isAuthenticated && bookmarkFragments.fetchAll());
  const bookmarkMutation = useMutate();
  const globalBookmarks =
    globalBookmarksUserObject?.user?.bookmarks?.result?.map((bookmark) => ({
      ...bookmark,
      key: bookmark.materialId + bookmark.materialType,
    }));

  const syncCookieBookmarks = async () => {
    if (!isAuthenticated) return; // Not authenticated
    const cookies = await JSON.parse(localStorage.getItem(KEY_NAME));
    if (!cookies || !Array.isArray(cookies) || cookies.length === 0) return; // Nothing to sync

    try {
      await bookmarkMutation.post(
        bookmarkMutations.addBookmarks({
          bookmarks: cookies.map((bookmark) => ({
            materialId: bookmark.materialId,
            materialType: bookmark.materialType,
          })),
        })
      );

      await mutateGlobalBookmarks();

      clearLocalBookmarks();
    } catch (e) {
      console.error("Error syncing local bookmarks", e);
    }
  };

  /**
   * Set a value in bookmark list
   */
  const setBookmark = async (value) => {
    if (isAuthenticated) {
      /**
       * API solution
       */
      await bookmarkMutation.post(
        bookmarkMutations.addBookmarks({
          bookmarks: [
            {
              materialId: value.id,
              materialType: value.materialType,
            },
          ],
        })
      );

      await mutateGlobalBookmarks();
    } else {
      /**
       * Cookie solution
       */

      // Find existing
      const existingIndex = localBookmarks?.findIndex(
        (obj) => obj.key === value.key
      );
      // push if not there
      if (existingIndex === -1) {
        localBookmarks?.push(value);
      }
      // remove if already there
      else {
        localBookmarks?.splice(existingIndex, 1);
      }

      // store
      const stringified = JSON.stringify(localBookmarks);
      localStorage.setItem(KEY_NAME, stringified);

      // mutate
      mutateLocalBookmarks(localBookmarks);
    }
  };

  function clearLocalBookmarks() {
    const empty = [];
    // store
    const stringified = JSON.stringify(empty);
    localStorage.setItem(KEY_NAME, stringified);
    //mutate
    mutateLocalBookmarks(empty);
  }

  return {
    setBookmark,
    clearLocalBookmarks,
    bookmarks: isAuthenticated ? globalBookmarks : localBookmarks,
    isLoading:
      (typeof localBookmarks === "undefined" && !error) ||
      (isLoadingGlobalBookmarks && !globalBookmarksError),
    syncCookieBookmarks,
  };
}

export const usePopulateBookmarks = (bookmarks) => {
  /**
   * Used to populate bookmark data, to show more info about the materials
   */
  const pids = bookmarks?.map((bookmark) => {
    /**
     * @TODO Rework
     */

    /* API data - or all */
    if (bookmark.materialId) return bookmark.materialId.replace("work-of:", "");

    /* Local data */
    if (bookmark.id.includes("work-of:"))
      return bookmark.id.replace("work-of:", "");
    return bookmark.id;
  });
  const { data } = useData(workFragments.pidsToWorks({ pids: pids }));
  return { data };
};
