export type Condition<S> =
  | S
  | { any: Condition<S>[] }
  | { all: Condition<S>[] }
  | { not: Condition<S> };

export type StringifyFn = (
  propertyName: string,
  value: string
) => string | null;

export type CssFn<HookName, CSSProperties> = (
  ...rules: (
    | (CSSProperties & {
        overrides?: [Condition<HookName>, CSSProperties][];
      })
    | undefined
  )[]
) => CSSProperties;

export type ConditionFn<HookName, CSSProperties> = (
  condition: Condition<HookName>
) => (properties: CSSProperties) => [Condition<HookName>, CSSProperties];

export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

export type CreateHooksFn<CSSProperties> = <
  const HooksConfig extends Record<string, Condition<HookImpl>>
>(config: {
  hooks: HooksConfig;

  fallback: "revert-layer" | "unset";

  debug?: boolean;

  sort?: {
    properties?: boolean;
    overrides?: boolean;
  };

  /** @internal */
  hookNameToId?: (
    hookName: HooksConfig extends Record<infer HookName, unknown>
      ? HookName
      : string
  ) => string;
}) => HooksConfig extends Record<infer HookName, unknown>
  ? {
      styleSheet: () => string;
      css: CssFn<HookName, CSSProperties>;
      condition: ConditionFn<HookName, CSSProperties>;
    }
  : never;

declare function buildHooksSystem<CSSProperties>(
  stringify?: StringifyFn
): CreateHooksFn<CSSProperties>;
