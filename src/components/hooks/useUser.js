import { useSession } from "next-auth/react";
import useSWR from "swr";
import { createContext, useMemo } from "react";
import merge from "lodash/merge";
import { useData, useMutate } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import * as sessionFragments from "@/lib/api/session.fragments";
import { useEffect, useState } from "react";
import { addUserToUserData } from "@/lib/api/userData.mutations";

// Context for storing anonymous session
export const AnonymousSessionContext = createContext();

// in memory object for storing loaner info for current user
let loanerInfoMock = {
  pickupBranch: "790900",
  rights: {
    infomedia: true,
    digitalArticleService: false,
    demandDrivenAcquisition: false,
  },
};

/**
 * Mock used in storybook
 */
function useUserMock() {
  const useUserMockKey = "useUserMock";
  const authUser = {
    name: "Some Name",
    mail: "some@mail.dk",
    rights: loanerInfoMock.rights,
  };
  const loggedInUser = {
    userName: authUser.name,
    userMail: authUser.mail,
  };
  const { data, mutate } = useSWR(useUserMockKey, () => loanerInfoMock, {
    initialData: loanerInfoMock,
  });

  return {
    authUser,
    isLoading: false,
    error: null,
    isAuthenticated: true,
    hasCulrUniqueId: true,
    isCPRValidated: true,
    isGuestUser: false,
    loanerInfo: { ...data, userParameters: { ...loggedInUser } },
    updateLoanerInfo: (obj) => {
      // Update global loaner info object
      loanerInfoMock = { ...loanerInfoMock, ...obj };
      // Broadcast update
      mutate(useUserMockKey);
    },
  };
}

/**
 * Hook for getting and storing loaner info
 */
function useUserImpl() {
  // Fetch loaner info from session
  const { data, mutate } = useData(sessionFragments.session());
  const { data: session } = useSession();
  const sessionMutate = useMutate();

  // user is authenticated thrue adgangsplatformen
  const isAuthenticated = !!session?.user?.userId;

  // user exists in CULR (CULR users can both include 'folk' and cpr-verified 'ffu' users)
  const hasCulrUniqueId = !!session?.user?.uniqueId;

  const { data: extendedUserData, isLoading: isLoadingExtendedData } = useData(
    hasCulrUniqueId && userFragments.extendedData()
  );

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userDataError,
    mutate: userMutate,
    isValidating,
  } = useData(isAuthenticated && userFragments.basic());

  let loggedInUser = {};
  if (userData?.user) {
    const user = userData.user;
    if (user.name) {
      loggedInUser.userName = user.name;
    }
    if (user.mail) {
      loggedInUser.userMail = user.mail;
    }
  }

  const sessionData = useMemo(() => {
    const sessionCopy = data?.session;

    // delete all keys with no value
    if (sessionCopy) {
      Object.keys(sessionCopy?.userParameters || {}).forEach((key) => {
        if (!sessionCopy?.userParameters[key]) {
          delete sessionCopy?.userParameters[key];
        }
      });
    }
    return {
      ...data?.session,
      userParameters: { ...loggedInUser, ...sessionCopy?.userParameters },
    };
  }, [data?.session, loggedInUser]);

  const [loanerInfo, setLoanerInfo] = useState({
    debt: [],
    loans: [],
    orders: [],
    agencies: [],
    ...sessionData,
  });

  //if user is logged in and has a uniqueId - and user is NOT already created in userData service, then create user.
  useEffect(() => {
    if (
      hasCulrUniqueId &&
      !isLoadingExtendedData &&
      !extendedUserData?.user?.createdAt
    ) {
      addUserToUserData({ userDataMutation: sessionMutate });
    }
  }, [hasCulrUniqueId, extendedUserData, isLoadingExtendedData]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoanerInfo({
        debt: [],
        loans: [],
        orders: [],
        agencies: [],
        ...sessionData,
      });
    } else if (userData && !userIsLoading) {
      setLoanerInfo({
        debt: userData?.user?.debt?.result || [],
        loans: userData?.user?.loans?.result || [],
        orders: userData?.user?.orders?.result || [],
        agencies: userData?.user?.agencies,
        municipalityAgencyId: userData?.user?.municipalityAgencyId,
        ...sessionData,
      });
    }
  }, [
    JSON.stringify(userData),
    JSON.stringify(sessionData),
    isAuthenticated,
    userIsLoading,
    isValidating,
  ]);

  const hasUserParameters = Object.keys(loanerInfo?.userParameters).length > 0;

  return {
    authUser: userData?.user || {},
    isLoading: userIsLoading,
    error: userDataError,
    // User exist in culr
    hasCulrUniqueId,
    // User has added userParameters
    hasUserParameters,
    loanerInfo,
    updateUserData: () => {
      // Broadcast update
      userMutate();
    },
    updateLoanerInfo: async (obj) => {
      const newSession = merge({}, sessionData, obj);

      // Update global loaner info object
      await sessionMutate.post(sessionFragments.submitSession(newSession));
      // Broadcast update
      await mutate();
    },
    updateUserStatusInfo: async (type) => {
      // Broadcast update about either loans or orders
      let updatedData;
      switch (type) {
        case "LOAN":
          updatedData = { loans: userData?.user?.loans?.result };
          break;
        case "ORDER":
          updatedData = { orders: userData?.user?.orders?.result };
          break;
        default:
          break;
      }
      if (updatedData) await userMutate(updatedData);
    },
    deleteSessionData: async () => {
      // Delete global loaner info object
      await sessionMutate.post(sessionFragments.deleteSession());
      // Broadcast update
      await mutate();
    },
  };
}

// const useUser = process.env.STORYBOOK_ACTIVE ? useUserMock : useUserImpl;
const useUser = process.env.STORYBOOK_ACTIVE ? useUserMock : useUserImpl;
export default useUser;
