/**
 * @file Contains GraphQL queries
 *
 */

/**
 * Retriever id
 *
 * @param pid
 * @returns {{variables: {pid}, slowThreshold: number, query: string}}
 */
export function retrieverIdFromPid({ pid }) {
  return {
    query: `
      query ($pid: String!) {
        manifestation(pid: $pid) {
          access {
            ... on RetrieverService {
              id
            }
          }
        }
        monitor(name: "bibdknext_work_retriever")
      }
    `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

/**
 * Retriever
 *
 * @param {Object} variables
 * @param {string} variables.id
 *
 * @returns {Object} a query object
 */
export function retrieverArticle({ id }) {
  return {
    // delay: 4000, // for debugging
    query: `
    query ($id: String!) {
      retriever(id: $id) {
        error
        article {
          id
          headline
          subHeadline
          byLine
          publishingDate
          pages
          sourceName
          fullTextHtml
        }
      }
      monitor(name: "bibdknext_work_retriever")
    }
  `,
    variables: { id },
    slowThreshold: 3000,
  };
}
