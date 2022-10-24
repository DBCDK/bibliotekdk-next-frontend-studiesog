import PropTypes from "prop-types";

import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import styles from "./Skip.module.css";

/**
 *
 * Used for skipping specific content, by setting focus to
 * a other element with some given id. Component is only visible
 * on tab.
 */
export default function Skip({ id, className = "", label, dataCy = "skip" }) {
  if (typeof window === "undefined") {
    return null;
  }

  const element = document.getElementById(id);

  return (
    <Link
      className={`${styles.skip} ${className}`}
      onClick={() => element?.focus()}
      dataCy={dataCy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          element?.focus();
        }
      }}
      aria-label={label}
    >
      <Text>
        {Translate({
          context: "general",
          label: "skip",
        })}
      </Text>
    </Link>
  );
}

// PropTypes for component
Skip.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
};