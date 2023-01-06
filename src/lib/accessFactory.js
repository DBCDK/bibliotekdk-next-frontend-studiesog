import { chain } from "lodash";
import { AccessEnum } from "@/lib/enums";
import { encodeTitleCreator, infomediaUrl } from "@/lib/utils";
import { flattenMaterialType } from "@/lib/manifestationFactoryFunctions";

export function getAccessForSingleManifestation(manifestation) {
  return manifestation?.access?.map((singleAccess) => {
    return {
      ...singleAccess,
      ...(manifestation?.pid && { pid: manifestation?.pid }),
      ...(manifestation?.titles?.main?.length > 0 && {
        titles: manifestation?.titles?.main,
      }),
      ...(manifestation?.creators?.length > 0 && {
        creators: manifestation?.creators,
      }),
      ...(manifestation?.materialTypes?.length > 0 && {
        materialTypesArray: flattenMaterialType(manifestation),
      }),
    };
  });
}

export function getAllAccess(manifestations) {
  return manifestations?.flatMap(getAccessForSingleManifestation);
}

export function enrichInfomediaAccess(singleInfomediaAccess) {
  return singleInfomediaAccess?.id
    ? {
        ...singleInfomediaAccess,
        url: infomediaUrl(
          encodeTitleCreator(
            singleInfomediaAccess?.titles?.[0],
            singleInfomediaAccess?.creators?.[0]?.display
          ),
          `work-of:${singleInfomediaAccess?.pid}`,
          singleInfomediaAccess.id
        ),
        origin: "infomedia",
        accessType: "infomedia",
      }
    : singleInfomediaAccess;
}

export function enrichSingleAccess(singleAccess) {
  const enrichMapper = {
    [AccessEnum.INFOMEDIA_SERVICE]: () => enrichInfomediaAccess(singleAccess),
  }[singleAccess?.__typename];

  return enrichMapper ? enrichMapper() : singleAccess;
}

// Prioritisers
//
export function prioritiseAccessUrl(access) {
  const accessUrl_priorityPenalty = [
    typeof access.url !== "string" || !access.url,
    typeof access?.loginRequired === "boolean" &&
      access?.loginRequired === true,
    access?.origin === "DBC Webarkiv",
    true,
  ];

  return (
    accessUrl_priorityPenalty?.length -
    accessUrl_priorityPenalty?.findIndex((priority) => priority === true) -
    1
  );
}
export function prioritiseInfomediaService(access) {
  return typeof access?.id === "string" && access?.id ? 0 : 1;
}
export function prioritiseDigitalArticleService(access) {
  return typeof access?.issn === "string" && access?.issn ? 0 : 1;
}
export function prioritiseEreol(access) {
  const ereol_priorityPenalty = [
    typeof access.url !== "string" || !access.url,
    !["Ereolen", "Ereolen Go"].includes(access?.origin),
    ["Ereolen Go"].includes(access?.origin),
    ["Ereolen"].includes(access?.origin),
  ];
  return (
    ereol_priorityPenalty?.length -
    ereol_priorityPenalty?.findIndex((priority) => priority === true) -
    1
  );
}
export function prioritiseInterLibraryLoan(access) {
  return typeof access?.loanIsPossible === "boolean" && access?.loanIsPossible
    ? 0
    : 1;
}

/**
 * Prioritised access provides access with an object of primary and secondary priority.
 * - typenamePriority is based on the __typename property in access
 * - accessInternalValuePriority is based on deterministic and prioritised heuristics
 *   within each __typename (eg. "is the url present", "what is the origin", etc.)
 * @param access
 * @return {{typenamePriority: (number|*), accessInternalValuePriority: (*|number)}}
 */
export function prioritisedAccess(access) {
  const accessPriorityMapper = {
    // Et godt mantra: "Hurtigst, derefter tættest på kilden (altså også mest lignende oprindelige tilstand)"
    // ACCESS URL: alt andet > DBC Webarkiv
    [AccessEnum.ACCESS_URL]: () => prioritiseAccessUrl(access),
    // INFOMEDIA_SERVICE: id > nederst! (manglende id)
    [AccessEnum.INFOMEDIA_SERVICE]: () => prioritiseInfomediaService(access),
    // DIGITAL_ARTICLE_SERVICE
    [AccessEnum.DIGITAL_ARTICLE_SERVICE]: () =>
      prioritiseDigitalArticleService(access),
    // EREOL: Ereol > Ereolengo
    [AccessEnum.EREOL]: () => prioritiseEreol(access),
    // INTER_LIBRARY_LOAN: LoanIsPossible true > false
    [AccessEnum.INTER_LIBRARY_LOAN]: () => prioritiseInterLibraryLoan(access),
  };

  const indexAccess = Object.keys(accessPriorityMapper)?.findIndex(
    (singleAccess) => singleAccess === access?.__typename
  );
  const typenamePriority =
    indexAccess === -1 ? accessPriorityMapper.length : indexAccess;
  const accessInternalValuePriority =
    indexAccess === -1 ? 0 : accessPriorityMapper[access?.__typename]();

  return {
    typenamePriority: typenamePriority,
    accessInternalValuePriority: accessInternalValuePriority,
  };
}
/** --------------------- **/

/**
 * sortPrioritisedAccess sorts 2 accesses between each other using {@link prioritisedAccess}
 * The sorting can be used within {@link sort() on an array}
 * @param a
 * @param b
 * @return {number}
 */
export function sortPrioritisedAccess(a, b) {
  const priorityA = prioritisedAccess(a);
  const priorityB = prioritisedAccess(b);

  return (
    priorityA?.typenamePriority - priorityB?.typenamePriority ||
    priorityA?.accessInternalValuePriority -
      priorityB?.accessInternalValuePriority
  );
}

export function getAllEnrichedAccessSorted(manifestations) {
  return chain(manifestations)
    ?.flatMap(getAccessForSingleManifestation)
    ?.map(enrichSingleAccess)
    ?.sort(sortPrioritisedAccess)
    ?.value();
}

// TODO: Test this!
export function getAllowedAccesses(accesses, hasDigitalAccess) {
  const onlineAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename !== AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.__typename !== AccessEnum.DIGITAL_ARTICLE_SERVICE
  );

  const digitalArticleServiceAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.DIGITAL_ARTICLE_SERVICE &&
      hasDigitalAccess
  );

  const physicalAccesses = accesses?.filter(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.loanIsPossible === true
  );

  return [
    ...onlineAccesses,
    ...digitalArticleServiceAccesses?.slice(0, 1),
    ...physicalAccesses?.slice(0, 1),
  ];
}

export function getAllAllowedEnrichedAccessSorted(
  manifestations,
  hasDigitalAccess
) {
  return getAllowedAccesses(
    getAllEnrichedAccessSorted(manifestations),
    hasDigitalAccess
  );
}

/**
 * Check loanIsPossible on any access
 * @param allEnrichedAccesses
 * @return {boolean}
 */
export function checkRequestButtonIsTrue(allEnrichedAccesses) {
  return (
    allEnrichedAccesses?.filter(
      (singleAccess) =>
        singleAccess?.loanIsPossible && singleAccess?.loanIsPossible === true
    ).length > 0
  );
}

/**
 * Check digitalCopy on any
 * @param allEnrichedAccesses
 * @return {boolean}
 */
export function checkDigitalCopy(allEnrichedAccesses) {
  return !!allEnrichedAccesses?.find((singleAccess) => singleAccess?.issn);
}

/**
 * Check physicalCopy on any
 * @param allEnrichedAccesses
 * @return {boolean}
 */
export function checkPhysicalCopy(allEnrichedAccesses) {
  return !!allEnrichedAccesses?.find(
    (singleAccess) =>
      singleAccess?.__typename === AccessEnum.INTER_LIBRARY_LOAN &&
      singleAccess?.loanIsPossible === true
  );
}

export function accessUtils(manifestations) {
  const allEnrichedAccesses = getAllEnrichedAccessSorted(manifestations);
  const requestButtonIsTrue = checkRequestButtonIsTrue(allEnrichedAccesses);
  const digitalCopy = checkDigitalCopy(allEnrichedAccesses);
  const physicalCopy = checkPhysicalCopy(allEnrichedAccesses);

  return {
    allEnrichedAccesses: allEnrichedAccesses,
    getAllAllowedEnrichedAccessSorted(hasDigitalAccess) {
      return getAllAllowedEnrichedAccessSorted(
        manifestations,
        hasDigitalAccess
      );
    },
    requestButtonIsTrue: requestButtonIsTrue,
    digitalCopy: digitalCopy,
    physicalCopy: physicalCopy,
  };
}
