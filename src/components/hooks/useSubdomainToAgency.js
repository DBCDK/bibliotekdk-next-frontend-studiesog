//Given a subdomain, returns agency data. e.g. odense.gym.bib.dk -> returns odense agency data
import { signIn } from "@dbcdk/login-nextjs/client";

import { createContext, useContext } from "react";
import { hostToAgency } from "@/components/utils/hostToAagency";
import { useBranchInfo } from "@/components/hooks/useBranchInfo";
export const PagePropsContext = createContext(null);

const useAgencyFromSubdomain = () => {
  const { host } = useContext(PagePropsContext) || {};
  const options = hostToAgency(host);

  const branchInfo = useBranchInfo({ branchId: options.agency.branchId });
  const mergedAgency = { ...branchInfo, ...options.agency };

  return {
    ...options,
    agency: { ...mergedAgency },
    signIn: () =>
      signIn(
        "adgangsplatformen",
        {},
        { agency: mergedAgency?.agencyId, force_login: 1 }
      ),
  };
};

export default useAgencyFromSubdomain;
