export type JsonArrayType = Record<string, unknown>[];

export function parseNote(str: string): string | null {
    if (str == "-" || str == "" || str === "無") {
        return null;
    }
    return str;
}