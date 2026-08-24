let counter = 0;
/** Unique per process; the server echoes it so a response can be matched to its request. */
export const nextId = (prefix = "sdk"): string => `${prefix}-${++counter}-${Date.now().toString(36)}`;
