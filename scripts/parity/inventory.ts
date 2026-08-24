export interface Inventory { methods: string[]; resultTags: string[]; subscriptionKinds: string[]; eventKinds: string[]; protocol: number }

export function inventoryOf(schema: any): Inventory {
  const S = schema.schemas;
  return {
    protocol: schema.protocol,
    methods: S.request.oneOf.map((v: any) => v.properties.method.const).sort(),
    resultTags: S.success_response.$defs.ResponseResult.oneOf.map((v: any) => v.properties.type.const).sort(),
    subscriptionKinds: S.request.$defs.Subscription.oneOf.map((v: any) => v.properties.type.const).sort(),
    eventKinds: [...S.event.$defs.EventKind.enum].sort(),
  };
}

export interface Drift { added: string[]; removed: string[] }
const diff = (ours: string[], theirs: string[]): Drift => ({
  added: theirs.filter((x) => !ours.includes(x)),
  removed: ours.filter((x) => !theirs.includes(x)),
});

/** What the live herdr has that we do not (added), and what we have that it dropped (removed). */
export function compareInventories(ours: Inventory, theirs: Inventory) {
  return {
    protocol: { ours: ours.protocol, theirs: theirs.protocol, same: ours.protocol === theirs.protocol },
    methods: diff(ours.methods, theirs.methods),
    resultTags: diff(ours.resultTags, theirs.resultTags),
    subscriptionKinds: diff(ours.subscriptionKinds, theirs.subscriptionKinds),
    eventKinds: diff(ours.eventKinds, theirs.eventKinds),
  };
}

export const hasDrift = (c: ReturnType<typeof compareInventories>): boolean =>
  !c.protocol.same || [c.methods, c.resultTags, c.subscriptionKinds, c.eventKinds].some((d) => d.added.length || d.removed.length);
