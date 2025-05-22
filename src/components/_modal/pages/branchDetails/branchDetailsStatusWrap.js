import BranchDetailsStatus from "@/components/_modal/pages/branchDetails/branchDetailsStatus/BranchDetailsStatus";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";
import { useHoldingsForAgency } from "@/components/hooks/useHoldings";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";

export function BranchDetailsStatusWrap({ pids }) {
  // this is studiesøg - we always have an agency :)
  const { agency, isLoading: isLoadingHoldings } = useAgencyFromSubdomain();

  const { branches, reservableManifestations } = useHoldingsForAgency({
    pids,
    agencyId: agency?.agencyId,
  });

  const { hasDigitalCopy, isLoading: isLoadingAccess } = useManifestationAccess(
    { pids }
  );

  const branch = branches?.find(
    (branch) => branch?.branchId === agency?.branchId
  );

  const isLoading = isLoadingHoldings || isLoadingAccess;

  if (!isLoading && hasDigitalCopy) {
    return null;
  }

  return (
    <BranchDetailsStatus
      branch={branch}
      pids={reservableManifestations}
      isLoading={isLoading}
    />
  );
}
