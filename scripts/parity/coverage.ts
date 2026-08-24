/**
 * Which schema methods have a typed service wrapper. Pure: reads the service
 * sources as text and finds every `this.call("<method>"`. `HerdrClient.call`
 * covers everything at the type level; this is about the ergonomic layer.
 */
export function wrappedMethods(serviceSources: string[]): string[] {
  const found = new Set<string>();
  for (const src of serviceSources) for (const m of src.matchAll(/this\.call\("([^"]+)"/g)) found.add(m[1]!);
  return [...found].sort();
}

export function coverage(schemaMethods: string[], wrapped: string[]) {
  return {
    unwrapped: schemaMethods.filter((m) => !wrapped.includes(m)),
    stale: wrapped.filter((m) => !schemaMethods.includes(m)),
  };
}
