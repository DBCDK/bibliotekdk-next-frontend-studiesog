import gymAgencies from "./gymAgencies.json";
//TODO: get exact subdomain names from current urls https://odense.gym.bib.dk/
const agencyNames = [
  "roskilde",
  "soroeakademi",
  "odense",
  "greve",
  "slagelse",
  "stenhus",
];
//path to logo images
const logoPaths = {
  greve: "/schools/logo/greve.webp",
  odense: "/schools/logo/odense.svg",
  roskilde: "/schools/logo/roskilde.webp",
  slagelse: "/schools/logo/slagelse.webp",
  stenhus: "/schools/logo/stenhus.webp",
  soroeakademi: "/schools/logo/soroeakademi.webp",
};

const heroPath = {
  roskilde: "/schools/hero/roskilde.webp",
  greve: "/schools/hero/greve.webp",
  slagelse: "/schools/hero/slagelse.webp",
  stenhus: "/schools/hero/stenhus.webp",
  odense: "/schools/hero/odense.webp",
  soroeakademi: "/schools/hero/soroeakademi.webp",
};

const heroTxtsLabels = {
  greve: {
    heroTxt: "greveHeroTxt",
    readMore: "greveReadMore",
  },
  roskilde: {
    heroTxt: "roskildeHeroTxt",
    readMore: "roskildeReadMore",
  },
  slagelse: {
    heroTxt: "slagelseHeroTxt",
    readMore: "slagelseReadMore",
  },
  stenhus: {
    heroTxt: "stenhusHeroTxt",
    readMore: "stenhusReadMore",
  },
  odense: {
    heroTxt: "odenseHeroTxt",
    readMore: "odenseReadMore",
  },
  soroeakademi: {
    heroTxt: "soroeakademiHeroTxt",
    readMore: "soroeakademiReadMore",
  },
};

const faviconpaths = {
  roskilde: "/schools/favicon/roskilde.ico",
  greve: "/schools/favicon/greve.ico",
  slagelse: "/schools/favicon/slagelse.ico",
  stenhus: "/schools/favicon/stenhus.ico",
  odense: "/schools/favicon/odense.ico",
  soroeakademi: "/schools/favicon/soroeakademi.ico",
};

export function hostToAgency(host) {
  const agencyName = host?.split?.(".")?.[0];

  const validAgencyName = agencyNames.includes(agencyName)
    ? agencyName
    : "stenhus";

  const agency = gymAgencies[validAgencyName];

  return {
    agency,
    logoPath: logoPaths[validAgencyName],
    heroPath: heroPath[validAgencyName],
    favIconPath: faviconpaths[validAgencyName],
    heroTxts: heroTxtsLabels[validAgencyName],
  };
}
