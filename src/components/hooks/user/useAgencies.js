/**
 * @file - userRights
 * Get user rights only - we use them a lot of places
 */
import { useData } from "@/lib/api/api";
import { userAgencies } from "@/lib/api/user.fragments";
import * as sessionFragments from "@/lib/api/session.fragments";

export default function useAgencies() {
  const { data, isLoading } = useData(userAgencies());
  // Fetch session data stored in fbi-api
  const sessionRes = useData(sessionFragments.session());
  const pickupBranch = sessionRes?.data?.session?.pickupBranch;

  const municipalityAgencyId = data?.user?.municipalityAgencyId;
  const agencies = data?.user?.agencies;

  return {
    isLoading,
    municipalityAgencyId,
    pickupBranch,
    agencies,
  };
}
