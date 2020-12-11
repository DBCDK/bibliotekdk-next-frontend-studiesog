import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Badge from "@/components/base/badge";

import styles from "./Action.module.css";

/**
 * Function to create a action menu item
 *
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Action({
  className = "",
  href = null,
  badge = null,
  title = "Go!",
  icon = "star.svg",
  children = null,
  onClick = null,
  dataCy = null,
}) {
  // Use html a or the Link component
  const Wrap = onClick ? "a" : Link;

  // Set data-cy or dataCy prop according to Wrap element
  const cy = Wrap === "a" ? { "data-cy": dataCy } : { dataCy };

  return (
    <Wrap
      href={href}
      onClick={onClick}
      className={`${className} ${styles.action}`}
      {...cy}
    >
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      <Icon size={{ w: "auto", h: 2 }} src={icon} children={children} />
      <Text type="text3">{title}</Text>
    </Wrap>
  );
}

// PropTypes for component
Action.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  onClick: PropTypes.func,
  dataCy: PropTypes.string,
};
