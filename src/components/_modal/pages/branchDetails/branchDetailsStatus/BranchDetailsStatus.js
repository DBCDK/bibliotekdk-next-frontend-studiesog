import cx from "classnames";
import styles from "./BranchDetailsStatus.module.css";
import Text from "@/components/base/text";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import { LinkForBranch } from "@/components/_modal/pages/base/localizationsBase/linkForBranch/LinkForBranch";
import { HoldingStatusEnum } from "@/components/hooks/useHoldings";
import { useData } from "@/lib/api/api";
import Link from "@/components/base/link";
import { dk5 } from "@/lib/api/manifestation.fragments";
import { getAdvancedUrl } from "@/components/search/advancedSearch/utils";

/**
 * {@link BranchDetailsStatus} presents that Branch-wide status in {@link BranchDetails}
 *   using {@link AvailabilityLight}, {@link BranchStatusMessage}, {@link LinkForBranch}
 *
 * @param {Array.<string>} props.pids
 * @returns {React.ReactElement | null}
 */

export function Dk5({ pid }) {
  // get dk5 data
  const { data, isLoading, error } = useData(pid && dk5({ pid: pid }));

  console.log(data, isLoading, error, "USEDATA");

  const dk5link = getAdvancedUrl({
    type: "dk5",
    value: data?.manifestation?.classifications?.[0]?.code,
  });
  return (
    <div>
      {/*fisk*/}
      <Text type="text2" skeleton={isLoading} lines={1}>
        <Link
          href={dk5link}
          border={{ top: false, bottom: { keepVisible: true } }}
        >
          {data?.manifestation?.classifications?.[0]?.display}
        </Link>
      </Text>
    </div>
  );
}

export default function BranchDetailsStatus({ branch, pids, className }) {
  console.log(branch, pids, "BRANCH AND PIDS");

  const pid = pids[0];

  return (
    <div className={cx(styles.row_wrapper)}>
      <AvailabilityLight branch={branch} />
      <Text type="text2" tag="span" className={styles.message}>
        {branch?.holdingsMessage},
      </Text>
      {branch?.locations?.map((location) => {
        return (
          <Text
            type="text2"
            key={location}
            tag="span"
            className={styles.message}
          >
            {location}
          </Text>
        );
      })}
      <Dk5 pid={pid} />

      {branch?.holdings?.status !== HoldingStatusEnum.NOT_OWNED && false && (
        <div className={styles.link_for_branch}>
          <LinkForBranch library={branch} pids={pids} />
        </div>
      )}
      {/*<Dk5 pid={pid} />*/}
    </div>
  );
}
