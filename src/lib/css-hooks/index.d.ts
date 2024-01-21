/**
 * The condition under which a given hook or declaration applies
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
   * a number value. (A property like `width` would need to specify the `px`
   * unit, while `z-index` would not.)
   */
  propertyName: string,

  /**
   * The value to stringify
   */
  value: unknown
) => string | null;

/**
 * A style object, optionally enhanced with inline styles
 */
export type Rule<HookName, CSSProperties> = CSSProperties & {
  /**
   * Conditional styles, where the second item in each entry represents
   * the declarations and the first item expresses the condition under
   * which those declarations apply
   *
   * @remarks
   * One way to think about this structure is like a record. (Consider the
   * return value of `Object.entries({ ... })`.) However, because a normal
   * record is unable to represent advanced conditions, it is necessary to
   * model conditional styles as an array of tuples.
   */
  on?: [Condition<HookName>, CSSProperties][];
};

/**
 * This type exists to ensure that the experimental nature of the type is well-documented
 *
 * @typeParam T - The experimental type
 *
 * @experimental
 */
export type Experimental<T> = T;

/**
 * The type of the `css` function, used to transform a {@link Rule} into a flat
 * style object
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g. React's `CSSProperties` type)
 *
 * @returns A flat style object, with dynamic values derived from the
 * conditional styles specified
 */
export type CssFn<HookName, CSSProperties> = (
  /**
   * A style object, optionally enhanced with conditional styles
   */
  rule: Rule<HookName, CSSProperties>,

  /**
   * A list of style objects, each optionally enhanced with conditional styles
   */
  ...rules: Experimental<(Rule<HookName, CSSProperties> | undefined)[]>
) => CSSProperties;

/**
 * A basic hook implementation, which uses CSS syntax to define a selector or
 * at-rule
 *
 * @remarks
 * Two types are supported:
 * 1. A selector, where `&` is used as a placeholder for the element to which
 *    the condition applies. The `&` character must appear somewhere.
 * 2. A `@media`, `@container`, or `@supports` at-rule. The value must begin
 *    with one of these keywords, followed by a space.
 *
 * These can be combined using the {@link Condition} structure to form complex logic.
 */
export type HookImpl =
  | `${string}&${string}`
  | `@${"media" | "container" | "supports"} ${string}`;

/**
 * The configuration used to set up hooks
 */
export interface Config<Hooks> {
  /**
   * The hooks to make available for use in conditional styles
   */
  hooks: Hooks;

  /**
   * The fallback keyword to use when no other value is available. The
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/revert-layer | `revert-layer`}
   * keyword is functionally the best option, but
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/unset | `unset`}
   * has better compatibility.
   *
   * @remarks
   * It is currently reported that `revert-layer` has very limited browser
   * support, but it seems to have better support within inline styles.
   * Unfortunately, the published data make no distinction between CSS and
   * inline styles. Until compatibility is better-understood, this is a
   * "required option" to allow a sensible default to be chosen in the future
   * without breaking compatibility.
   */
  fallback: "revert-layer" | "unset";

  /**
   * Whether to enable debug mode
   *
   * @remarks
   * When debug mode is enabled:
   * 1. Hook identifiers (underlying CSS variables) are tagged with user-defined
   *    hook names.
   * 2. Extra whitespace is included in the style sheet and inline styles for
   *    enhanced readability
   */
  debug?: boolean;

  /**
   * Options for sorting declarations when multiple rules are passed to the
   * {@link CssFn | `css`} function
   *
   * @experimental
   */
  sort?: {
    /**
     * When enabled, the last property declared is sorted to the end, giving it
     * the highest priority.
     *
     * @remarks
     * Within a given rule, conditional styles are always treated as the last entry,
     * giving the properties declared within the highest priority within that
     * scope.
     *
     * @experimental
     *
     * @defaultValue true
     */
    properties?: boolean;

    /**
     * When enabled, conditional styles are sorted to the end of the list of rules passed
     * to the `css` function, giving them the highest priority.
     *
     * @remarks
     * You may want to consider disabling this option when
     * - you are publishing a component library;
     * - you expose a `style` prop allowing client overrides; and
     * - you wish to hide CSS Hooks as an implementation detail (meaning that
     *   the `style` prop has the standard type for CSS Properties with no
     *   `on` field).
     *
     * @experimental
     *
     * @defaultValue true
     */
    conditionalStyles?: boolean;
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
}

/**
 * The {@link CssFn | `css`} function used to define enhanced styles, along with the style sheet required to support it
 *
 * @typeParam HookName - The name of the hooks available for use in style
 * conditions
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g. React's `CSSProperties` type)
 */
interface Hooks<HookName, CSSProperties> {
  /**
   * The `css` function used to define enhanced styles
   */
  css: CssFn<HookName, CSSProperties>;

  /**
   * The style sheet required to support the configured hooks
   */
  styleSheet: () => string;
}

/**
 * The function used to define hooks and related configuration
 *
 * @typeParam CSSProperties - The type of a standard (flat) style object,
 * typically defined by an app framework (e.g. React's `CSSProperties` type)
 *
 * @param config - The configuration used to define hooks and adjust the related
 * functionality as needed depending on use case
 */
export type CreateHooksFn<CSSProperties> = <
  Hooks extends Record<string, Condition<HookImpl>>
>(
  config: Config<Hooks>
) => Hooks extends Record<infer HookName, unknown>
  ? Hooks<HookName, CSSProperties>
  : never;

/**
 * Creates a flavor of CSS Hooks tailored to a specific app framework.
 *
 * @param stringify - The function used to stringify values when merging
 * conditional styles
 *
 * @returns The `createHooks` function used to bootstrap CSS Hooks within an app
 * or component library
 *
 * @remarks
 * Primarily for internal use, advanced use cases, or when an appropriate
 * framework integration is not provided
 */
declare function buildHooksSystem<CSSProperties>(
  stringify?: StringifyFn
): CreateHooksFn<CSSProperties>;
