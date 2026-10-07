/**
 * @file Contains GraphQL queries
 *
 */

/**
 * Informedia id
 *
 * @param pid
 * @returns {{variables: {pid}, slowThreshold: number, query: string}}
 */
export function infomediaIdFromPid({ pid }) {
  return {
    query: `
      query ($pid: String!) {
        manifestation(pid: $pid) {
          access {
            ... on InfomediaService {
              id
            }
          }
        }
        monitor(name: "bibdknext_work_infomedia")
      }
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

/**
 * Infomedia
 *
 * @param {Object} variables
 * @param {string} variables.id
 *
 * @returns {Object} a query object
 */
export function infomediaArticle({ id }) {
  return {
    // delay: 4000, // for debugging
    query: `
    query ($id: String!) {
      infomedia(id: $id) {
        error
        article {
          id
          headLine
          subHeadLine
          dateLine
          byLine
          paper
          text
          hedLine
          logo
        }
      }
      monitor(name: "bibdknext_work_infomedia")
    }
  `,
    variables: { id },
    slowThreshold: 3000,
  };
}
