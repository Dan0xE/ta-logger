export function debugMode(): boolean {
    return process.env.NODE_ENV === "development";
}