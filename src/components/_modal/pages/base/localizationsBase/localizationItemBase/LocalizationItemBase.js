import cx from "classnames";
import styles from "./LocalizationItemBase.module.css";
import Link from "@/components/base/link/Link";
import ArrowSvg from "@/public/icons/arrowright.svg";
import Icon from "@/components/base/icon";
import animations from "css/animations";
import { AvailabilityEnum } from "@/components/hooks/useHandleAgencyAccessData";
import { AvailabilityLight } from "@/components/_modal/pages/base/localizationsBase/localizationItemBase/AvailabilityLight";
import Text from "@/components/base/text/Text";

/**
 * @typedef { import("../../../agencyLocalizations/agencyLocalizationItem/AgencyLocalizationItem").default} AgencyLocalizationItem
 * @typedef { import("../../../branchLocalizations/branchLocalizationItem/BranchLocalizationItem").default} BranchLocalizationItem
 */

/**
 * LocalizationItemBase is used as a base for {@link AgencyLocalizationItem} and {@link BranchLocalizationItem}
 * @param {Object} props
 * @param {React.ReactNode | null} props.children
 * @param {function} props.modalPush
 * @param {Array.<AvailabilityEnum>} props.possibleAvailabilities
 * @param {boolean} props.itemLoading
 * @param {AvailabilityEnum} props.availabilityAccumulated
 * @returns {React.ReactElement | null}
 */
export default function LocalizationItemBase({
  children,
  modalPush,
  possibleAvailabilities = [
    AvailabilityEnum.NOW,
    AvailabilityEnum.LATER,
    AvailabilityEnum.NEVER,
    AvailabilityEnum.NOT_OWNED,
    AvailabilityEnum.UNKNOWN,
  ],
  itemLoading,
  availabilityAccumulated,
}) {
  return (
    <div className={cx(styles.container)}>
      <Link
        border={{ top: { keepVisible: true }, bottom: { keepVisible: true } }}
        className={cx(styles.wrapper)}
        onClick={modalPush}
        disabled={itemLoading}
      >
        {itemLoading ? (
          <Text skeleton={true} clamp={true} lines={2} />
        ) : (
          <div className={cx(styles.row_wrapper)}>
            {possibleAvailabilities.includes(availabilityAccumulated) && (
              <AvailabilityLight
                availabilityAccumulated={availabilityAccumulated}
              />
            )}
            <div className={styles.result}>{children}</div>
            <Icon
              size={{ w: "auto", h: 3 }}
              alt=""
              className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
            >
              <ArrowSvg />
            </Icon>
          </div>
        )}
      </Link>
    </div>
  );
}