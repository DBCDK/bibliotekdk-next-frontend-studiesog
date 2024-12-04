import Title from "@/components/base/title";
import Top from "../../base/top";
import styles from "./MultiOrder.module.css";
import Translate from "@/components/base/translate";
import CheckoutForm from "./checkoutForm/MultiOrderCheckoutForm";
import Material from "./Material/Material";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import BlockedUserInformation from "@/components/_modal/pages/order/blockeduserinformation/BlockedUserInformation";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import NoAgenciesError from "../../order/noAgencies/NoAgenciesError";
import {
  useMultiOrderValidation,
  useOrderFlow,
} from "@/components/hooks/order";
import useAgencies from "@/components/hooks/user/useAgencies";
import Skeleton from "@/components/base/skeleton";

const CONTEXT = "bookmark-order";

const MultiOrder = () => {
  const { orders } = useOrderFlow();

  const { identityProviderUsed, isLoading: isLoadingAuthentication } =
    useAuthentication();

  const { agencies: userAgencies, isLoading: isLoadingAgencies } =
    useAgencies();
  const { physicalMaterialsCount } = useMultiOrderValidation({
    orders,
  });

  if (isLoadingAuthentication || isLoadingAgencies) {
    return (
      <Skeleton lines={10} className={styles.skeleton}>
        <div>loading</div>
      </Skeleton>
    );
  }
  if (
    identityProviderUsed === "nemlogin" &&
    userAgencies?.agencies?.length === 0
  ) {
    return <NoAgenciesError />;
  }

  return (
    <div className={styles.multiOrder}>
      <Top
        title={Translate({
          context: CONTEXT,
          label: "multiorder-title",
        })}
        titleTag="h2"
        className={{ top: styles.top }}
      />
      {orders?.length > 0 && (
        <Title type="text2" tag="h3" className={styles.subHeading}>
          <Translate
            context={CONTEXT}
            label={
              orders?.length === 1
                ? "multiorder-subheading-singular"
                : "multiorder-subheading"
            }
            vars={[orders?.length]}
          />
        </Title>
      )}
      {physicalMaterialsCount > 0 && (
        <BlockedUserInformation className={styles.nousererror} />
      )}

      {orders?.length > 0 && (
        <>
          <div className={styles.materialList}>
            {orders?.map(({ pids }, i) => (
              <Material key={i} material={{}} pids={pids} />
            ))}
          </div>
          <section className={styles.checkoutContainer}>
            <CheckoutForm />
          </section>
        </>
      )}
      {orders?.length === 0 && (
        <div>
          <Title type="text2" tag="h3" className={styles.subHeading}>
            <Translate context={CONTEXT} label="multiorder-no-materials" />
          </Title>
        </div>
      )}
    </div>
  );
};

export default MultiOrder;
