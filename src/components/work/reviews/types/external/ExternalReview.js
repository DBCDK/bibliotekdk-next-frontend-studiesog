import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Rating from "@/components/base/rating";
import Translate from "@/components/base/translate";

import { dateToShortDate } from "@/utils/datetimeConverter";

import styles from "./ExternalReview.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function ExternalReview({
  className = "",
  data = [],
  onFocus = null,
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "reviews" };

  return (
    <Col
      xs={12}
      sm={6}
      md={4}
      className={`${styles.litteratursiden} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "litteratursiden" })}
    >
      <Row>
        {data.media && (
          <Col xs={12} className={styles.media}>
            <Title type="title4" skeleton={skeleton}>
              {data.media}
            </Title>
          </Col>
        )}
        <div className={styles.row}>
          {data.author && (
            <Col className={styles.left}>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({ context: "general", label: "by" })}
              </Text>
            </Col>
          )}

          <Col xs={12} className={styles.right}>
            {data.author && (
              <Col xs={10} className={styles.author}>
                {!skeleton && <Text type="text2">{data.author}</Text>}
                <div className={styles.date}>
                  {!skeleton && data.date && (
                    <Text type="text3">
                      {dateToShortDate(data.date, "d. ")}
                    </Text>
                  )}
                </div>
              </Col>
            )}

            {data.rating && (
              <Col xs={12} className={styles.rating}>
                <Rating rating={data.rating} skeleton={skeleton} />
              </Col>
            )}
          </Col>
        </div>

        {data.url && (
          <Col xs={12} className={styles.url}>
            <Icon
              src="chevron.svg"
              size={{ w: 2, h: "auto" }}
              skeleton={skeleton}
              alt=""
            />
            <Link
              href={data.url}
              target="_blank"
              onFocus={onFocus}
              disabled={!data.url}
              border={{ top: false, bottom: { keepVisible: true } }}
            >
              <Text type="text2" skeleton={skeleton}>
                {Translate({
                  ...context,
                  label: "reviewLinkText",
                })}
              </Text>
            </Link>
          </Col>
        )}
      </Row>
    </Col>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export function ExternalReviewSkeleton(props) {
  const data = {
    author: "Svend Svendsen",
    reviewType: "INFOMEDIA",
    date: "2013-06-25",
    media: "Litteratursiden.dk online",
    url: "http://",
  };

  return (
    <ExternalReview
      {...props}
      data={data}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { data, skeleton } = props;

  if (skeleton) {
    return <ExternalReviewSkeleton />;
  }

  return <ExternalReview {...props} data={data} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};