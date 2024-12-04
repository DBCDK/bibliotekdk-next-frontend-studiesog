/**
 * @file - userRights
 * Get user rights only - we use them a lot of places
 */
import { useData } from "@/lib/api/api";
import { userAgencies } from "@/lib/api/user.fragments";

export default function useAgencies() {
  const { data, isLoading } = useData(userAgencies());

  const agencies = data?.user?.agencies;

  return {
    isLoading,
    agencies,
  };
}
