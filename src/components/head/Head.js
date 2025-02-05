import Head from "next/head";

import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

import Translate from "@/components/base/translate";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";

export default function _Head() {
  const { agency, favIconPath } = useAgencyFromSubdomain();
  const context = { context: "metadata" };
  const pageTitle = agency?.name || "Studiesøg";
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const { canonical, alternate } = useCanonicalUrl();

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta
        key="description"
        name="description"
        content={pageDescription}
      ></meta>
      <meta key="og:url" property="og:url" content={canonical.url} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={pageDescription}
      />
      <meta
        key="og:image"
        property="og:image"
        content={"/img/bibdk-default-img.png"}
      />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
      <link rel="icon" href={favIconPath} sizes="any" type="image/x-icon" />
      <link rel="alternate icon" href={favIconPath} />
      {alternate.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={url} />
      ))}

      <meta name="mobile-web-app-capable" content="yes"></meta>
      <meta name="theme-color" content="#3333ff"></meta>
    </Head>
  );
}
