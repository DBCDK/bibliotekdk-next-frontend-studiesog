import PropTypes from "prop-types";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import { retrieverArticle } from "@/lib/api/retriever.fragments";
import LoginPrompt from "./Prompt";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useAgencyFromSubdomain from "@/components/hooks/useSubdomainToAgency";

/**
 * Prompt the user for log in when not authenticated or
 * to explains how to obtain access, when user is not granted access
 * to the article
 *
 */
export default function ArticleLoginPrompt({ articleId }) {
  const { signIn } = useAgencyFromSubdomain();
  const { loanerInfo, isLoading: isLoadingLoanerInfo } = useLoanerInfo();
  const { isAuthenticated } = useAuthentication();
  const hasRetrieverAccess = loanerInfo?.rights?.infomedia;

  const { data, isLoading } = useData(
    isAuthenticated && articleId && retrieverArticle({ id: articleId })
  );

  //NOT AUTHENTICATED --> Show login button and reminder that not all libraries give access to infomedia
  if (!isAuthenticated) {
    return (
      <LoginPrompt
        title={Translate({ context: "articles", label: "getAccess" })}
        description={Translate({
          context: "articles",
          label: "accessWarning",
        })}
        signIn={signIn}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  //AUTHENTICATED AND NO ACCESS either because, we couldnt fetch article (shoudl we show error instead?)
  // OR bc user doesnt have access rights
  // --> Show library name and explain how to obtain access
  if (
    !isLoading &&
    !isLoadingLoanerInfo &&
    (!data?.retriever?.article || !hasRetrieverAccess)
  ) {
    const linkHref = {
      href: "https://slks.dk/omraader/kulturinstitutioner/biblioteker",
      text: Translate({ context: "articles", label: "libraryAccessReadMore" }),
    };
    return (
      <LoginPrompt
        title={Translate({
          context: "articles",
          label: "libraryNoAccess",
        })}
        description={Translate({
          context: "articles",
          label: "accessOpportunity",
        })}
        description2={Translate({
          context: "articles",
          label: "accessOpportunity3",
        })}
        linkHref={linkHref}
        signIn={openLoginModal}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // All good, no login prompt needed
  return null;
}

ArticleLoginPrompt.propTypes = {
  articleId: PropTypes.string,
};
