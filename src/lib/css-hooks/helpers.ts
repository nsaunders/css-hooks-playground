import type { Condition } from ".";

export function all<S>(...and: Condition<S>[]) {
  return { and };
}

export function any<S>(...or: Condition<S>[]) {
  return { or };
}

export function not<S>(not: Condition<S>) {
  return { not };
}

export function $<S, P>(
  condition: Condition<S>,
  properties: P
): [Condition<S>, P] {
  return [condition, properties];
}
