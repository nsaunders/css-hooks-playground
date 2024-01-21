/**
 * The condition under which a given hook or property applies
 *
 * @typeParam S - The basic type of condition to enhance with boolean operations
 */
export type Condition<S> =
  | S
  | { any: Condition<S>[] }
  | { all: Condition<S>[] }
  | { not: Condition<S> };

/**
 * The function used to convert a value into a string
 *
 * @remarks
 * This is needed for merging an override property value with the
 * default/fallback value.
 *
 * @returns The stringified value, or `null` if the value can't be stringified
 */
export type StringifyFn = (
  /**
   * The property name corresponding to the value being stringified
   *
   * @remarks
   * For example, React uses this to determine whether to apply a `px` suffix to
   * a number value.
   */
  propertyName: string,

  /**
   * The value to stringify
   */
  value: unknown
) => string | null;

/**
 * The type of the `css` function, used to transform a style object enhanced
 * with hooks into a flat map of declarations
 *
 * @typeParam HookName - The name of the hooks available for use in conditional
 * overrides
 *
 * @typeParam CSSProperties - The type of a standard style object, typically
 * defined by a UI framework (e.g. React's `CSSProperties` type)
 *
 * @returns An ordinary style object representing a flat list of declarations,
 * with dynamic values derived from the conditional overrides specified
 */
export type CssFn<HookName, CSSProperties> = (
  /**
   * A list of rules to transform
   *
   * @remarks
   * Each rule is a style object, optionally enhanced with conditional overrides
   */
  ...rules: (
    | (CSSProperties & {
        overrides?: [Condition<HookName>, CSSProperties][];
      })
    | undefined
  )[]
) => CSSProperties;

/**
 * The type of the `condition` function used to define conditional overrides
 */
export type ConditionFn<HookName, CSSProperties> = (
  /** The condition under which the specified properties should apply */
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
    /**
     * When enabled, the last property declared is sorted to the end, giving it
     * the highest priority.
     *
     * @remarks
     * Within a given rule, overrides are always treated as the last entry,
     * giving the properties declared within the highest priority within that
     * scope.
     *
     * @defaultValue true
     *
     * @experimental
     */
    properties?: boolean;

    /**
     * When enabled, overrides are sorted to the end of the list of rules passed
     * to the {@link CssFn}, giving them the highest priority.
     *
     * @remarks
     * You may want to consider disabling this option when
     * - you are publishing a component library;
     * - you expose a `style` prop allowing client overrides; and
     * - you wish to hide CSS Hooks as an implementation detail (meaning that
     *   the `style` prop has the standard type for CSS Properties with no
     *   `overrides` field).
     *
     * @defaultValue true
     *
     * @experimental
     */
    overrides?: boolean;
  };

  /**
   * This option allows you to customize how hook names are transformed into
   * valid CSS identifiers. Useful for testing.
   *
   * @internal
   */
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
