/**
 * @file
 * The file for handling the materialType enums.
 * The order of the {@link MaterialTypeOrderEnum} is
 * based on the work of the User Experience Designer
 * and is subject for gradual change
 */

/** TODO: Maybe use a map like this instead of
 *   flattening the materialTypes as in
 *   "selectMaterialBasedOnType"
 * */
export const MaterialTypeEnum = Object.freeze({
  BOG: "bog",
  EBOG: "ebog",
  "LYDBOG (NET)": "lydbog (net)",
  "LYDBOG (CD-MP3)": "lydbog (cd-mp3)",
  "LYDBOG (CD)": "Lydbog (cd)",
  "LYDBOG (BÅND)": "lydbog (bånd)",
});

/* This */
export const MaterialTypeOrderEnum = Object.freeze({
  LITERATURE: {
    BOG: { display: "bog", code: "123" },
    EBOG: { display: "ebog", code: "123" },
    "LYDBOG (NET)": { display: "lydbog (net)", code: "123" },
    "LYDBOG (CD-MP3)": { display: "lydbog (cd-mp3)", code: "123" },
    "LYDBOG (CD)": { display: "lydbog (cd)", code: "123" },
    BILLEDBOG: { display: "billedbog", code: "123" },
    "GRAPHIC NOVEL": { display: "graphic novel", code: "123" },
    TEGNESERIE: { display: "tegneserie", code: "123" },
    "BOG STOR SKRIFT": { display: "bog stor skrift", code: "123" },
  },
  MOVIE: {
    "FILM (NET)": { display: "film (net)", code: "123" },
    "FILM (BLU-RAY 4K)": { display: "blu-ray 4k", code: "123" },
    "FILM (BLU-RAY 3D)": { display: "blu-ray 3d", code: "123" },
    "FILM (BLU-RAY)": { display: "blu-ray", code: "123" },
    "FILM (DVD)": { display: "dvd", code: "123" },
  },
  MUSIC: {
    "MUSIK (NET)": { display: "musik (net)", code: "123" },
    "CD (MUSIK)": { display: "cd (musik)", code: "123" },
    GRAMMOFONPLADE: { display: "grammofonplade", code: "123" },
  },
  SHEETMUSIC: {
    "E-NODE": { display: "e-node", code: "123" },
    NODE: { display: "node", code: "123" },
    "NODE (CD)": { display: "node (cd)", code: "123" },
  },
  GAME: {
    "PLAYSTATION 5": { display: "playstation 5", code: "123" },
    "PLAYSTATION 4": { display: "playstation 4", code: "123" },
    "PLAYSTATION 3": { display: "playstation 3", code: "123" },
    PLAYSTATION: { display: "playstation", code: "123" },
    "XBOX SERIES": { display: "xbox series", code: "123" },
    "XBOX ONE": { display: "xbox one", code: "123" },
    "XBOX 360": { display: "xbox 360", code: "123" },
    XBOX: { display: "xbox 360", code: "123" },
    "PC-SPIL": { display: "pc-spil", code: "123" },
    COMPUTERSPIL: { display: "computerspil", code: "123" },
    "NINTENDO SWITCH": { display: "nintendo switch", code: "123" },
    WII: { display: "wii", code: "123" },
  },
});

export function prioritiseByWorkType(a, b, workTypes) {
  const indexA = workTypes.findIndex((workType) => a[0] === workType);
  const indexB = workTypes.findIndex((workType) => b[0] === workType);

  const indexAFilterNull = indexA === -1 ? workTypes.length : indexA;
  const indexBFilterNull = indexB === -1 ? workTypes.length : indexB;

  return indexAFilterNull - indexBFilterNull;
}

export function getOrderedFlatMaterialTypes(
  workTypes = [],
  materialTypeEnum = MaterialTypeOrderEnum
) {
  return Object.entries(materialTypeEnum)
    .sort((a, b) => prioritiseByWorkType(a, b, workTypes))
    .flatMap((mat) => Object.values(mat[1]))
    .map((mat) => mat.display);
}