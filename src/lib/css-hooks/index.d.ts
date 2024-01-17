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
  rules: (CSSProperties | [Condition<HookName>, CSSProperties])[]
) => CSSProperties;

export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

export type CreateHooksFn<CSSProperties> = <const HookName>(
  config: Record<HookName, Condition<HookImpl>>
) => [HooksFn, CssFn<HookName, CSSProperties>];

declare function buildHooksSystem<CSSProperties>(
  stringify?: StringifyFn
): CreateHooksFn<CSSProperties>;

export { buildHooksSystem };
