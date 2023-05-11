import Header from "@/components/header/Header";
import { useRouter } from "next/router";

import Page from "@/components/profile/MyLibrariesPage";
/**
 * Renders the MyLibraries component
 */
export default function MyLibraries() {
  const router = useRouter();

  return (
    <>
      <Header router={router} />
      <Page />
    </>
  );
}
