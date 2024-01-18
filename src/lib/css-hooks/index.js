// @ts-nocheck

function genericStringify(_, value) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return null;
}

function hash(obj) {
  const jsonString = JSON.stringify(obj);

  let hashValue = 0;

  for (let i = 0; i < jsonString.length; i++) {
    const charCode = jsonString.charCodeAt(i);
    hashValue = (hashValue << 5) - hashValue + charCode;
    hashValue &= 0x7fffffff;
  }

  return hashValue.toString(36);
}

function normalizeCondition(cond) {
  if (!cond) {
    return undefined;
  }
  if (typeof cond === "string") {
    return cond;
  }
  if (typeof cond !== "object") {
    return undefined;
  }
  if ("not" in cond) {
    if (!cond.not) {
      return undefined;
    }
    if (cond.not.not) {
      return normalizeCondition(cond.not.not);
    }
    const inner = normalizeCondition(cond.not);
    return inner ? { not: inner } : undefined;
  }
  const [operator] = Object.keys(cond);
  const [head, ...tail] = cond[operator]
    .map(normalizeCondition)
    .filter((x) => x);
  if (!head) {
    return undefined;
  }
  if (tail.length === 0) {
    return head;
  }
  if (tail.length === 1) {
    return { [operator]: [head, tail[0]] };
  }
  return { [operator]: [head, normalizeCondition({ [operator]: tail })] };
}

function buildHooksSystem(stringify = genericStringify) {
  return function createHooks(config, options) {
    const [space, newline] = options && options.debug ? [" ", "\n"] : ["", ""];
    const indent = `${space}${space}`;

    const hookNameToId =
      (options || {}).hookNameToId ||
      ((hookName) => {
        const specHash = hash(config[hookName]);
        return options && options.debug
          ? `${hookName.replace(/[^A-Za-z0-9-]/g, "_")}-${specHash}`
          : specHash;
      });

    function hooks() {
      function variablePair({ id, initial, indents }) {
        return [0, 1]
          .map(
            (i) =>
              `${Array(indents).fill(indent).join("")}--${id}-${i}:${space}${
                initial === i ? "initial" : space ? "" : " "
              };${newline}`
          )
          .join("");
      }

      let sheet = `*${space}{${newline}`;

      const normalizedConfig = Object.entries(config)
        .map(([hookName, hookSpec]) => [hookName, normalizeCondition(hookSpec)])
        .filter(([hookName, hookSpec]) => hookSpec);

      for (const [hookName, hookSpec] of normalizedConfig) {
        (function it(id, hookSpec, initial = 0) {
          if (hookSpec && typeof hookSpec === "object") {
            if ("not" in hookSpec) {
              return it(id, hookSpec.not, 1);
            }

            if ("and" in hookSpec || "or" in hookSpec) {
              const operator = hookSpec.and ? "and" : "or";
              it(`${id}A`, hookSpec[operator][0]);
              it(`${id}B`, hookSpec[operator][1]);
              if (operator === "and") {
                sheet += `${indent}--${id}-0:${space}var(--${id}A-0)${space}var(--${id}B-0);${newline}`;
                sheet += `${indent}--${id}-1:${space}var(--${id}A-1,${space}var(--${id}B-1));${newline}`;
              } else {
                sheet += `${indent}--${id}-0:${space}var(--${id}A-0,${space}var(--${id}B-0));${newline}`;
                sheet += `${indent}--${id}-1:${space}var(--${id}A-1)${space}var(--${id}B-1);${newline}`;
              }
              return;
            }
          }
          sheet += variablePair({ id, initial, indents: 1 });
        })(hookNameToId(hookName), hookSpec);
      }

      sheet += `}${newline}`;

      for (const [hookName, hookSpec] of normalizedConfig) {
        (function it(id, hookSpec, initial = 0) {
          if (hookSpec && typeof hookSpec === "object") {
            if ("not" in hookSpec) {
              return it(id, hookSpec.not, 1);
            }

            if ("and" in hookSpec || "or" in hookSpec) {
              const operator = hookSpec.and ? "and" : "or";
              it(`${id}A`, hookSpec[operator][0]);
              it(`${id}B`, hookSpec[operator][1]);
              return;
            }
          }

          if (typeof hookSpec === "string") {
            if (hookSpec[0] === "@") {
              sheet += [
                `${hookSpec}${space}{${newline}`,
                `${indent}*${space}{${newline}`,
                variablePair({
                  id,
                  initial: initial === 0 ? 1 : 0,
                  indents: 2,
                }),
                `${indent}}${newline}`,
                `}${newline}`,
              ].join("");
            } else {
              sheet += [
                `${hookSpec.replace(/&/g, "*")}${space}{${newline}`,
                variablePair({
                  id,
                  initial: initial === 0 ? 1 : 0,
                  indents: 1,
                }),
                `}${newline}`,
              ].join("");
            }
          }
        })(hookNameToId(hookName), hookSpec);
      }

      return sheet;
    }

    function css(items) {
      const style = {};
      let conditionCount = 0;
      for (const item of items) {
        if (!item || typeof item !== "object") {
          continue;
        }
        if (item instanceof Array && item.length === 2) {
          let condition = normalizeCondition(item[0]);
          if (!condition) {
            continue;
          }
          if (typeof condition === "string") {
            condition = hookNameToId(condition);
          } else if (typeof condition === "object") {
            condition = (function it(name, cond) {
              if (typeof cond === "string") {
                return hookNameToId(cond);
              }
              if (cond.not) {
                const inner = it(`${name}X`, cond.not);
                style[`--${name}-0`] = `var(--${inner}-1)`;
                style[`--${name}-1`] = `var(--${inner}-0)`;
              }
              if (cond.and || cond.or) {
                const operator = cond.and ? "and" : "or";
                const a = it(`${name}A`, cond[operator][0]);
                const b = it(`${name}B`, cond[operator][1]);
                if (operator === "and") {
                  style[`--${name}-0`] = `var(--${a}-0)${space}var(--${b}-0)`;
                  style[`--${name}-1`] = `var(--${a}-1,${space}var(--${b}-1))`;
                } else {
                  style[`--${name}-0`] = `var(--${a}-0,${space}var(--${b}-0))`;
                  style[`--${name}-1`] = `var(--${a}-1)${space}var(--${b}-1)`;
                }
              }
              return name;
            })(`cond${conditionCount++}`, condition);
          }
          for (const [property, value] of Object.entries(item[1])) {
            const stringifiedValue = stringify(property, value);
            if (stringifiedValue === null) {
              continue;
            }
            const fallbackValue =
              property in style
                ? style[property]
                : (options || {}).fallbackValue || "unset";
            delete style[property];
            style[
              property
            ] = `var(--${condition}-1,${space}${stringifiedValue})${space}var(--${condition}-0,${space}${fallbackValue})`;
          }
          continue;
        }
        for (const [property, value] of Object.entries(item)) {
          delete style[property];
          style[property] = value;
        }
      }
      return style;
    }

    return [hooks, css];
  };
}

export { buildHooksSystem };
