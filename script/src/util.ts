export type JsonArrayType = { [key: string]: unknown };

export const parseNote = (str: string): string | null =>
  str === "-" || str === "" || str === "無" ? null : str;
