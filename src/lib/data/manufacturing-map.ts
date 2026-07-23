import "server-only";

type ManufacturingProduct = { model: string };

export const manufacturingCatalog: Record<string, ManufacturingProduct> = {
  "HS-PC-MER": { model: "Bolte" },
  "HS-PC-RID": { model: "Sausalito" },
  "HS-PC-MES": { model: "Woomera" },
  "HS-PC-SUM": { model: "Turin" },
  "HS-PC-HAW": { model: "Barossa" },
  "HS-PC-WES": { model: "Tonso" },
  "HS-PC-BRI": { model: "Padthaway" },
  "HS-PC-FAI": { model: "Bondi" },
  "HS-PC-WIN": { model: "Pitcairn" },
  "HS-PC-GRA": { model: "Queensland" },
};

export const manufacturingFinish: Record<string, string> = {
  "Paint Grade": "Paint Grade",
  Smooth: "Smooth",
  "Stone World": "Stone World",
};

export const manufacturingColor: Record<string, string> = {
  Chalk: "Kingsbury",
  Pearl: "Grecian",
  Sand: "Indian Summer",
  Fog: "London Fog",
};
