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

export function select<const Properties>(properties: Properties) {
  return {
    always: properties,
    where<S>(condition: Condition<S>) {
      return [condition, properties] as [Condition<S>, Properties];
    },
  };
}
