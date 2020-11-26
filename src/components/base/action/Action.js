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
  href = "/",
  badge = null,
  title = "Go!",
  icon = "star.svg",
  children = null,
  dataCy = null,
}) {
  return (
    <Link
      href={href}
      className={`${className} ${styles.action}`}
      dataCy={dataCy}
    >
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      <Icon size={2} src={icon} children={children} />
      <Text type="text3">{title}</Text>
    </Link>
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
  dataCy: PropTypes.string,
};
