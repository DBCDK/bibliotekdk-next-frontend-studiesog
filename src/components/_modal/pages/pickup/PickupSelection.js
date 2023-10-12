import { useEffect, useRef, useState } from "react";
import List from "@/components/base/forms/list";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Pickup.module.css";
import animations from "css/animations";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import find from "lodash/find";
import cx from "classnames";
import { handleOnSelect } from "@/components/_modal/utils";

/**
 * Special component responsible for loading order policy
 * Will not render anything, but needs to be mounted
 */
function PolicyLoader({ branch, onLoad, pid, requireDigitalAccess }) {
  const pickupAllowed = branch?.pickupAllowed;
  let { data } = useData(
    pid &&
      branch?.branchId &&
      branchesFragments.branchOrderPolicy({
        branchId: branch.branchId,
        pids: [pid],
      })
  );

  const orderPolicy =
    branch?.orderPolicy || data?.branches?.result?.[0]?.orderPolicy;

  const digitalCopyAccess = data?.branches?.result?.[0]?.digitalCopyAccess;

  useEffect(() => {
    if (orderPolicy || !pickupAllowed) {
      onLoad({
        pickupAllowed,
        orderPossible: requireDigitalAccess
          ? digitalCopyAccess
          : !pickupAllowed
          ? false
          : orderPolicy?.orderPossible,
      });
    }
  }, [digitalCopyAccess, orderPolicy, pickupAllowed]);

  return null;
}

/**
 * Row that desplays a branch
 * @param {Object} branch
 * @param {boolean} selected
 * @param {function} onSelect
 * @param {boolean} isLoading
 * @param {boolean} includeArrows
 * @param {Object} _ref
 * @returns {React.JSX.Element}
 */
function Row({ branch, selected, onSelect, isLoading, includeArrows, _ref }) {
  // Check for a highlight key matching on "name" prop
  const matchName = find(branch.highlights, {
    key: "name",
  });
  // If found, use matchned name (wraps match in <mark>...</mark>)
  const title = matchName?.value || branch.name;

  // If none found use a alternative match if any found
  const matchOthers = !matchName ? branch.highlights?.[0]?.value : null;

  const disabled = !branch.pickupAllowed; //TODO wouldnt these branches be shown in ordernotpossible list/should we sort them out earlier?

  return (
    <List.FormLink
      selected={selected?.branchId === branch.branchId}
      onSelect={() => onSelect(branch)}
      label={branch.name}
      disabled={disabled}
      className={cx(animations["on-hover"], {
        [styles.squeeze]: matchOthers,
        [styles.disabled]: disabled,
      })}
      includeArrows={includeArrows}
      _ref={_ref}
    >
      <>
        <Text
          lines={1}
          skeleton={isLoading}
          type="text2"
          dataCy={`text-${branch.name}`}
          className={[
            animations["h-border-bottom"],
            animations["h-color-blue"],
          ].join(" ")}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </Text>
        {matchOthers && (
          <Text type="text3" className={styles.alternativeMatch}>
            <span
              dangerouslySetInnerHTML={{
                __html: matchOthers,
              }}
            />
          </Text>
        )}
      </>
    </List.FormLink>
  );
}

export default function PickupSelection(props) {
  const {
    data,
    selected,
    isVisible,
    isLoading,
    includeArrows,
    updateLoanerInfo,
    // modal props
    context,
    modal,
  } = { ...props };

  // Get pid from modal context
  const { pid, requireDigitalAccess } = context;

  const loadedOrderPolicies = useRef({});
  const render = useState()[1];

  // Incrementally creates a list of allowed branches as policies load one by one,
  // keeping the order of the original result
  let allPoliciesLoaded = !isLoading;

  const orderPossibleBranches =
    data?.result?.filter((branch) => {
      if (!allPoliciesLoaded) {
        return false;
      }
      if (!loadedOrderPolicies.current[`${branch.branchId}_${pid}`]) {
        allPoliciesLoaded = false;
        return false;
      }
      return loadedOrderPolicies.current[`${branch.branchId}_${pid}`]
        ?.orderPossible;
    }) || [];

  const orderNotPossibleBranches =
    (allPoliciesLoaded &&
      data?.result?.filter(
        (branch) =>
          !loadedOrderPolicies.current[`${branch.branchId}_${pid}`]
            ?.orderPossible
      )) ||
    [];

  //TODO: cant we show all agencies?
  const hasMoreMessage =
    allPoliciesLoaded &&
    data?.hitcount > data?.result?.length &&
    Translate({ context: "order", label: "has-more-pickup" });

  return (
    <>
      {/* This only loads order policies, does not render anything */}
      {data?.result
        ?.filter((branch) => branch.branchId)
        .map((branch) => {
          const key = `${branch.branchId}_${pid}`;
          return (
            <PolicyLoader
              key={key}
              branch={branch}
              onLoad={(policy) => {
                loadedOrderPolicies.current[key] = policy;
                render({});
              }}
              pid={pid}
              requireDigitalAccess={requireDigitalAccess}
            />
          );
        })}

      {orderPossibleBranches.length > 0 && (
        <List.Group
          enabled={!isLoading && isVisible}
          data-cy="list-branches"
          className={styles.orderPossibleGroup}
          disableGroupOutline
        >
          {orderPossibleBranches.map((branch, idx) => {
            return (
              <Row
                key={`${branch.branchId}-${idx}`}
                branch={branch}
                selected={selected}
                onSelect={(branch) =>
                  handleOnSelect(branch, modal, context, updateLoanerInfo)
                }
                modal={modal}
                isLoading={isLoading}
                includeArrows={includeArrows}
              />
            );
          })}
        </List.Group>
      )}
      {!allPoliciesLoaded && (
        <Text type="text2" className={styles.loadingText}>
          {Translate({ context: "order", label: "check-policy-loading" })}
        </Text>
      )}
      {hasMoreMessage && (
        <Text type="text2" className={styles.loadingText}>
          {hasMoreMessage}
        </Text>
      )}
      {orderNotPossibleBranches.length > 0 && (
        <>
          <Text type="text1" className={styles.pickupNotAllowedTitle}>
            {Translate({ context: "order", label: "pickup-not-allowed" })}
          </Text>
          <ul>
            {orderNotPossibleBranches.map((branch, idx) => {
              return (
                <li key={`${branch.branchId}-${idx}`}>
                  <Text type="text3">{branch.name}</Text>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
