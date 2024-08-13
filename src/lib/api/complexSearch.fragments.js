import { ApiEnums } from "@/lib/api/api";
import {
  creatorsFragment,
  materialTypesFragment,
  tvSeriesFragment,
} from "@/lib/api/fragments.utils";

/**
 * Hitcount
 *
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function doComplexSearchAll({ cql, offset, limit, sort, facets }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchAll($cql: String!, $offset: Int!, $limit: PaginationLimit!, $sort: [Sort!], $facets: complexSearchFacets) {
			complexSearch(cql: $cql, facets: $facets) {
				hitcount
				errorMessage
        facets {
          name
          values {
            key
            score
          }
        }				
				works(limit: $limit, offset: $offset, sort: $sort) {
          workId
          latestPublicationDate
          series {
            title            
            members{
              numberInSeries
              work{
                workId
              }
        }
          }
          mainLanguages {
            isoCode
            display
          }
          workTypes
          manifestations {
            mostRelevant{
              pid
              ownerWork {
                workTypes
              }
              cover {
                detail
                origin
              }
              materialTypes {
                ...materialTypesFragment
              }
              hostPublication {
                title
                issue
              }
              publisher
              edition {
                summary
                edition
              }
            }            
          }
          creators {
            ...creatorsFragment
          }
          materialTypes {
            ...materialTypesFragment
          }
          fictionNonfiction {
            display
          }
          genreAndForm
          titles {
            main
            full
            parallel
            sort
            tvSeries {
            ...tvSeriesFragment
            }
          }
        }
			}
		},
    ${creatorsFragment}
    ${materialTypesFragment}
    ${tvSeriesFragment}`,
    variables: { cql, offset, limit, sort, facets },
    slowThreshold: 3000,
  };
}

/**
 * Hitcount
 *
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function complexSearchOnlyWorkIds({ cql, offset, limit, sort }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchOnlyWorkIds($cql: String!, $offset: Int!, $limit: PaginationLimit!, $sort: [Sort!]) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage
				works(offset: $offset, limit: $limit, sort: $sort) {
					workId
        }
			}
		}`,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
  };
}

export function ComplexArticleSlider({ cql, offset, limit, sort }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ComplexArticleSlider($cql: String!, $offset: Int!, $limit: PaginationLimit!, $sort: [Sort!]) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage        
				works(offset: $offset, limit: $limit, sort: $sort) {
          workId
          titles {
            main
            full
          }
          creators {
            ...creatorsFragment
          }
          
          manifestations {mostRelevant {
            materialTypes {
              ...materialTypesFragment
            }
            cover {
              detail
              origin
            }
          }}
        }
      }
    }
    ${creatorsFragment}
    ${materialTypesFragment}
    `,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
  };
}

/**
 * Hitcount
 *
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function hitcount({ cql, offset, limit, sort, facets }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query hitcount($cql: String!, $facets: complexSearchFacets) {
			complexSearch(cql: $cql, facets: $facets) {
				hitcount
				errorMessage
				facets {
          name
          values {
            key
            score
          }
        }			
			}
		}`,
    variables: { cql, offset, limit, sort, facets },
    slowThreshold: 3000,
  };
}

export function complexFacetsOnly({ cql, facets }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query facetsOnly($cql: String!, $facets: complexSearchFacets) {
			complexFacets(cql: $cql, facets: $facets) {
				facets {
          name
          values {
            key
            score
          }
        }			
			}
		}`,
    variables: { cql, facets },
    slowThreshold: 3000,
  };
}
