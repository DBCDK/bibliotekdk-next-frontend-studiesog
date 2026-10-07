export function accessForManifestations({ pids }) {
  return {
    query: `query AccessForManifestations($pids: [String!]!) {
      manifestations(pid: $pids) {
        pid
        unit {
          manifestations {
            pid
            titles {
              main
            }
            creators {
              display
            }
            access {
              __typename
              ... on AccessUrl {
                origin
                url
                note
                loginRequired
                type
                status
              }
              ... on InfomediaService {
                id
              }
              ... on Ereol {
                origin
                url
                canAlwaysBeLoaned
                note
              }
              ... on DigitalArticleService {
                issn
              }
              ... on InterLibraryLoan {
                loanIsPossible
              }
            }
          }
        }
      }
    }`,
    variables: { pids },
    delay: 400,
  };
}
