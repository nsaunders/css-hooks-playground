export type Condition<S> =
  | S
  | { and: Condition<S>[] }
  | { or: Condition<S>[] }
  | { not: Condition<S> };

export type StringifyFn = (
  propertyName: string,
  value: string
) => string | null;

export type HooksFn = () => string;

export type CssFn<HookName, CSSProperties> = (
  ...rules: (CSSProperties | [Condition<HookName>, CSSProperties])[]
) => CSSProperties;

export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

export type CreateHooksFn<CSSProperties> = <
  const Config extends Record<string, Condition<HookImpl>>
>(
  config: Config
) => Config extends Record<infer HookName, unknown>
  ? [HooksFn, CssFn<HookName, CSSProperties>]
  : never;

declare function buildHooksSystem<CSSProperties>(
  stringify?: StringifyFn
): CreateHooksFn<CSSProperties>;

export { buildHooksSystem };
