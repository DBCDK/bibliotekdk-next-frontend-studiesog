import styles from "./UniverseTitleBox.module.css";
// {/*TODO: Insert this again later when we know how to interpret this */}
// import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Text from "@/components/base/text/Text";
import cx from "classnames";
export default function UniverseTitleBox({ universe, className }) {
  const description = universe?.description;

  return (
    <div
      className={cx(className, styles.box, {
        [styles.boxWithoutDescription]: !description,
      })}
    >
      <Title type="title2" tag={"h1"} className={styles.universe_title}>
        {universe?.title}
      </Title>
      {description && (
        <Text type="text2" className={styles.universe_description}>
          {description}
        </Text>
      )}
      {/*TODO: Insert this again later when we know how to interpret this */}
      {/*<Text type="text2" className={styles.universe_length}>*/}
      {/*  {Translate({*/}
      {/*    context: "universe_page",*/}
      {/*    label: "parts_in_universe",*/}
      {/*    vars: [universe?.series?.length + universe?.works?.length],*/}
      {/*  })}*/}
      {/*</Text>*/}
    </div>
  );
}
