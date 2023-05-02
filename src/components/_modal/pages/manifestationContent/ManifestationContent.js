/**
 * @file ManifestationContent.js
 * Show manifesttionParts in modal
 */
import Top from "@/components/_modal/pages/base/top";
import Edition from "@/components/_modal/pages/edition/Edition";
import ManifestationParts from "@/components/manifestationparts/ManifestationParts";
import styles from "./ManifestationContent.module.css";

export default function ManifestationContent(props) {
  const { pid, showOrderTxt, singleManifestation } = props.context;
  return (
    <div>
      <Top className={styles} title="Indhold" />
      <Edition
        showOrderTxt={showOrderTxt}
        singleManifestation={singleManifestation}
        context={{ orderPids: [pid] }}
      />

      <ManifestationParts
        pid={pid}
        showMoreButton={false}
        titlesOnly={false}
        className={styles.contentlist}
      />
    </div>
  );
}