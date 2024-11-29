import { useContext } from "react";
import { PagePropsContext } from "@/components/hooks/useSubdomainToAgency";
import gymAgencies from "@/components/utils/gymAgencies.json";

//TODO: get exact subdomain names from current urls https://odense.gym.bib.dk/
const agencyNames = [
  "roskilde",
  "soroeakademi",
  "odense",
  "greve",
  "slagelse",
  "stenhus",
];

// do NOT use the useData hook (or hooks using the useData hook) here - the fetcher also uses this hook - @see /src/lib/api/api.js/useFetcherImpl()
export function useSubDomainToBrancId() {
  const { host } = useContext(PagePropsContext) || {};
  const agencyName = host?.split?.(".")?.[0];

  const validAgencyName = agencyNames.includes(agencyName)
    ? agencyName
    : "stenhus";

  const agency = gymAgencies[validAgencyName];
  // console.log(agency, "agency");
  return { agency, branchId: agency.branchId };
}
