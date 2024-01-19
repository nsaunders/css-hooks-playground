export type Condition<S> =
  | S
  | { and: Condition<S>[] }
  | { or: Condition<S>[] }
  | { not: Condition<S> };

export type StringifyFn = (
  propertyName: string,
  value: string
) => string | null;

export type CssFn<HookName, CSSProperties> = (
  ...rules: (CSSProperties | [Condition<HookName>, CSSProperties])[]
) => CSSProperties;

export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

export type CreateHooksFn<CSSProperties> = <
  const HooksConfig extends Record<string, Condition<HookImpl>>
>(config: {
  hooks: HooksConfig;

  fallback: "revert-layer" | "unset";

  debug?: boolean;

  /** @internal */
  hookNameToId?: (
    hookName: HooksConfig extends Record<infer HookName, unknown>
      ? HookName
      : string
  ) => string;
}) => HooksConfig extends Record<infer HookName, unknown>
  ? { styleSheet: () => string; css: CssFn<HookName, CSSProperties> }
  : never;

declare function buildHooksSystem<CSSProperties>(
  stringify?: StringifyFn
): CreateHooksFn<CSSProperties>;

// prettier-ignore
declare function all<A>(a: A): { and: [A] };
// prettier-ignore
declare function all<A, B>(a: A, b: B): { and: [A, B] };
// prettier-ignore
declare function all<A, B, C>(a: A, b: B, c: C): { and: [A, B, C] };
// prettier-ignore
declare function all<A, B, C, D>(a: A, b: B, c: C, d: D): { and: [A, B, C, D] };
// prettier-ignore
declare function all<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): { and: [A, B, C, D, E] };
// prettier-ignore
declare function all<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): { and: [A, B, C, D, E, F] };
// prettier-ignore
declare function all<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): { and: [A, B, C, D, E, F, G] };
// prettier-ignore
declare function all<A, B, C, D, E, F, G, H>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): { and: [A, B, C, D, E, F, G, H] };
// prettier-ignore
declare function all<A, B, C, D, E, F, G, H, I>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): { and: [A, B, C, D, E, F, G, H, I] };
// prettier-ignore
declare function all<A, B, C, D, E, F, G, H, I, J>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J): { and: [A, B, C, D, E, F, G, H, I, J] };

// prettier-ignore
declare function any<A>(a: A): { or: [A] };
// prettier-ignore
declare function any<A, B>(a: A, b: B): { or: [A, B] };
// prettier-ignore
declare function any<A, B, C>(a: A, b: B, c: C): { or: [A, B, C] };
// prettier-ignore
declare function any<A, B, C, D>(a: A, b: B, c: C, d: D): { or: [A, B, C, D] };
// prettier-ignore
declare function any<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): { or: [A, B, C, D, E] };
// prettier-ignore
declare function any<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): { or: [A, B, C, D, E, F] };
// prettier-ignore
declare function any<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): { or: [A, B, C, D, E, F, G] };
// prettier-ignore
declare function any<A, B, C, D, E, F, G, H>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): { or: [A, B, C, D, E, F, G, H] };
// prettier-ignore
declare function any<A, B, C, D, E, F, G, H, I>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): { or: [A, B, C, D, E, F, G, H, I] };
// prettier-ignore
declare function any<A, B, C, D, E, F, G, H, I, J>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J): { or: [A, B, C, D, E, F, G, H, I, J] };

declare function not<A>(a: A): { not: A };

declare function rs<HookName, CSSProperties>(
  condition: Condition<HookName>,
  properties: CSSProperties
): [Condition<HookName>, CSSProperties];
