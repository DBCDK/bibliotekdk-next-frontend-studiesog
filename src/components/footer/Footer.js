import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import Language from "@/components/base/language";
import Link from "@/components/base/link";
import styles from "./Footer.module.css";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";

/** @file
 * Footer
 * holds a section with logo and three columns with description and links
 * well section .. rather a copy paste from the Section component
 */

/**
 * First column holds a description of bibliotek.dk and a link to administer
 * cookie settings
 * @returns {React.JSX.Element}
 */
// const FirstColumn = () => {
//   let label = Translate({ context: "footer", label: "hvad_er_bibliotek_dk" });
//   return (
//     <div className={styles.about}>
//       <Text type="text3" lines={1}>
//         {label}
//       </Text>
//       <div className={styles.spacer}></div>
//       <Link
//         border={{ bottom: { keepVisible: true } }}
//         onClick={() => Cookiebot.show()}
//         className={styles.footerlink}
//       >
//         <Text tag="span" type="text3">
//           {Translate({
//             context: "general",
//             label: "administer_cookies",
//           })}
//         </Text>
//       </Link>
//     </div>
//   );
// };

/**
 * Second column holds link to contact, help, press etc.
 * @returns {React.JSX.Element}
 */
const SecondColumn = () => {
  const { agency } = useAgencyFromSubdomain();

  let label = Translate({ context: "footer", label: "contact" });
  const skeleton = agency?.isLoading;

  return (
    <React.Fragment>
      <Text type="text4">{label}</Text>
      <div className={styles.spacer}></div>
      <div className={styles.contactContainer}>
        <Text type="text3" skeleton={skeleton ? styles.skeleton : ""}>
          {agency?.agencyName}
        </Text>
        {agency?.postalAddress && (
          <Text type="text3">{agency?.postalAddress}</Text>
        )}
        {agency?.postalCode && (
          <Text type="text3">
            {agency?.city} {agency?.postalCode}
          </Text>
        )}
        {agency?.contactPerson && (
          <Text type="text3">{agency?.contactPerson}</Text>
        )}
        <Text type="text3">{agency?.branchEmail}</Text>
        {agency?.alternativeContact && (
          <Text type="text3">{agency?.alternativeContact}</Text>
        )}
        {agency?.branchPhone && <Text type="text3">{agency?.branchPhone}</Text>}
      </div>
      <ContactLinks />
      <Link
        border={{ bottom: { keepVisible: true } }}
        onClick={() => Cookiebot.show()}
        className={styles.footerlink}
      >
        <Text tag="span" type="text3">
          {Translate({
            context: "general",
            label: "administer_cookies",
          })}
        </Text>
      </Link>
      {agency?.digst && (
        <div>
          <Link
            border={{ bottom: { keepVisible: true } }}
            href={agency?.digst}
            className={styles.footerlink}
          >
            <Text tag="span" type="text3">
              {Translate({
                context: "footer",
                label: "accessibility",
              })}
            </Text>
          </Link>
        </div>
      )}
    </React.Fragment>
  );
};

/**
 * Generate links for contacts
 * @returns {unknown[]}
 */
const ContactLinks = () => {
  // Object holding info to generate contact links * NOTICE Keys of objects are translated.
  const contact_links = {
    // find_library: { pathname: "/", query: {} },
    // about: { pathname: "/hjaelp/om-bibliotek-dk/24", query: {} },
    // help: { pathname: "/hjaelp", query: {} },
    // press: { pathname: "/", query: {} },
    //  contact: { pathname: "/hjaelp/kontakt-os/25", query: {} },
    privacy: {
      pathname: "/privatlivspolitik",
      query: {},
    },
    // suppliers: {
    //   pathname: "/artikel/leverandører/59",
    //   query: {},
    // },
    // English: { pathname: "/", query: {} },
    // accessibility: {
    //   pathname: "https://www.was.digst.dk/bibliotek-dk",
    //   query: {},
    //   target: "_blank",
    // },
  };

  const FooterLink = function ({ href, children, onClick, target = "_self" }) {
    return (
      <Link
        href={href}
        border={{ bottom: { keepVisible: true } }}
        className={styles.footerlink}
        dataCy="contactlink"
        onClick={onClick}
        target={target}
      >
        <Text tag="span" type="text3">
          {children}
        </Text>
      </Link>
    );
  };

  return Object.keys(contact_links).map((key) => {
    let href = {
      pathname: contact_links[key].pathname,
      query: contact_links[key].query,
    };
    let target = contact_links[key].target
      ? contact_links[key].target
      : "_self";
    let item = (
      <FooterLink href={href} target={target}>
        {Translate({ context: "footer", label: `${key}` })}
      </FooterLink>
    );

    if (key === "English") {
      item = (
        <Language>
          <FooterLink href={contact_links[key]}>
            {Translate({ context: "language", label: "english-danish" })}
          </FooterLink>
        </Language>
      );
    }

    return <div key={key}>{item}</div>;
  });
};

/**
 * Defines the footer section - one row with four columns
 * @returns {React.JSX.Element}
 */
const FooterSection = () => {
  return (
    <footer className={styles.containerback}>
      <Container fluid>
        <Row
          as="section"
          className={`${styles.background} `}
          data-cy="footer-section"
        >
          <Col
            // md={{ span: 3, order: 3, offset: 1 }}
            // xs={{ span: 6, order: 1 }}
            className={styles.padder}
            data-cy="footer-column"
          >
            <SecondColumn />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default function Footer() {
  return <FooterSection />;
}
