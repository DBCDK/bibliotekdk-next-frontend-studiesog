import Title from "../title";
import Text from "../text";
import Button from "../button";

import styles from "./Storybook.module.css";

/**
 * Function to copy text to clipboard
 *
 * @param {string} text
 *
 */
function copyToClipboard(text) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function CopyButton({ el, txt = "Copy" }) {
  return (
    <Button
      className={styles.copy}
      type="secondary"
      size="small"
      onClick={() => copyToClipboard(el)}
    >
      {txt}
    </Button>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook titles
 *
 * @param {obj} children
 *
 * @returns {component}
 */
export function StoryTitle({ children, copy = false }) {
  const el = "<StoryTitle>Im a storybook title</StoryTitle>";

  return (
    <div className={styles.title}>
      <Title type="title4">{children}</Title>

      {copy && <CopyButton el={el} txt="Copy Title element" />}
    </div>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook descriptions
 *
 * @param {obj} children
 *
 * @returns {component}
 */
export function StoryDescription({ children, copy }) {
  const el =
    "<StoryDescription>Im a storybook description ...</StoryDescription>";

  return (
    <div className={styles.description}>
      <Text type="text2">{children}</Text>

      {copy && <CopyButton el={el} txt="Copy Description element" />}
    </div>
  );
}

/**
 * (FOR INTERNAL/STORYBOOK USE ONLY!)
 * Function to return storybook spacing
 *
 * @param {string} space
 * @param {string} direction
 * @param {bool} demo // makes spaces visible
 *
 * @returns {component}
 */
export function StorySpace({ demo = false, space, direction = "h" }) {
  const demoClass = demo ? styles.demo : "";
  const key = `${direction}-space-${space}`;
  const spaceClass = styles[key];

  return <div className={`${styles.space} ${spaceClass} ${demoClass}`} />;
}
