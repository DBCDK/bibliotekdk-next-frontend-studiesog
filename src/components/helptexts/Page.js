import PropTypes from "prop-types";

import { HelpText, HelpTextMenu } from "./HelpText";
import { useData } from "@/lib/api/api";
import styles from "@/components/header/Header.module.css";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";
import { HelpTextHeader } from "./HelpTextHeader";
import { Title } from "@/components/base/title/Title";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments";

/**
 * HelpText page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function HelpTextPage(helptxtId) {
  const { isLoading, data } = useData(publishedHelptexts());
  if (!data || !data.nodeQuery || !data.nodeQuery.entities || data.error) {
    // @TODO skeleton
    return null;
  }

  const allHelpTexts = data.nodeQuery.entities;
  const aHelpText = helpTextById(allHelpTexts, helptxtId);

  return (
    <Container className={styles.header} fluid>
      <Row>
        <Col md={{ span: 3 }}>
          <HelpTextHeader />
        </Col>
        <Col md={{ span: 9 }}>
          <Title type="title4">Hjælp og vejledninger</Title>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 3 }}>
          <HelpTextMenu helpTextId={helptxtId} />
        </Col>
        <Col md={{ span: 9 }}>
          <HelpText helptext={aHelpText} />
        </Col>
      </Row>
    </Container>
  );
}

function helpTextById(allHelpTexts, helpTxtId) {
  return allHelpTexts.find(
    ({ nid }) => parseInt(helpTxtId.helptxtId, "10") === nid
  );
}

HelpTextPage.propTypes = {
  helptxtId: PropTypes.string,
};
