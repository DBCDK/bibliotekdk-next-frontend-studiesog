/**
 * @file
 * This is the index page of the application
 *
 */

import ArticleSection from "@/components/article/section";
import Hero from "@/components/hero";
import Head from "next/head";
import { promotedArticles } from "@/lib/api/article.fragments";
import { fetchAll } from "@/lib/api/apiServerOnly";
import Header from "@/components/header/Header";
import Translate from "@/components/base/translate";
import React from "react";
import { useRouter } from "next/router";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import { frontpageHero } from "@/lib/api/hero.fragments";
import { useData } from "@/lib/api/api";
import { parseHero } from "@/components/hero/Hero";

const Index = () => {
  const context = { context: "metadata" };
  const pageTitle = Translate({ ...context, label: "frontpage-title" });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const router = useRouter();

  const { data } = useData(frontpageHero());
  const ogImage = parseHero(data);
  const { canonical, alternate } = useCanonicalUrl();

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content={canonical.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {ogImage && ogImage.image && ogImage.image.ogurl && (
          <meta property="og:image" content={`${ogImage?.image?.ogurl}`} />
        )}
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
        <link
          rel="icon"
          href="public/favicon.svg"
          sizes="any"
          type="image/svg+xml"
        />
        <link rel="alternate icon" href="public/favicon.ico" />
        {alternate.map(({ locale, url }) => (
          <link key={url} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>
      <div>
        <Header router={router} />
        <Hero />
        <ArticleSection
          title={Translate({ context: "index", label: "section1" })}
          matchTag="section 1"
          template="triple"
          topSpace={false}
        />
        <ArticleSection
          title={Translate({ context: "index", label: "section2" })}
          matchTag="section 2"
          template="triple"
        />
        <ArticleSection
          title={Translate({ context: "index", label: "section3" })}
          matchTag="section 3"
          template="double"
        />
        <ArticleSection title={false} matchTag="section 4" template="single" />
      </div>
    </React.Fragment>
  );
};

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 */
const serverQueries = [promotedArticles, frontpageHero];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Index.getInitialProps = async (ctx) => {
  return await fetchAll(serverQueries, ctx);
};

export default Index;
