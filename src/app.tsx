/*

// e.g.

css(
  {
    background: "black",
    color: "white",
  },
  rs("&:disabled", {
    color: "#999",
  }),
  rs(all("&:enabled", "&:hover"), {
    color: "pink",
  }),
)

*/

import { buildHooksSystem } from "./lib/css-hooks";
import { stringifyValue } from "@css-hooks/react";
import { rs, all, any, not } from "./lib/css-hooks";

import { CSSProperties } from "react";

const createHooks = buildHooksSystem<CSSProperties>(stringifyValue);

const { styleSheet, css } = createHooks({
  hooks: {
    a: ":has([name='a']:checked) &",
    b: ":has([name='b']:checked) &",
    c: ":has([name='c']:checked) &",
    d: ":has([name='d']:checked) &",
    e: ":has([name='e']:checked) &",
    f: ":has([name='f']:checked) &",
    hover: all("&:hover", "@media (hover:hover)"),
  },
  debug: true,
  fallback: "unset",
});

const mutedColor = "#999";

export function App() {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: styleSheet(),
        }}
      />
      <div style={{ display: "flex" }}>
        {(["a", "b", "c", "d", "e", "f"] as const).map((x) => (
          <label
            key={x}
            style={css(
              {
                textAlign: "center",
              },
              rs(x, {
                background: "black",
                color: "white",
              }),
              rs(all("hover", not(x)), {
                background: "#ccc",
              }),
              rs(all("hover", x), {
                background: "#333",
              })
            )}
          >
            {x}
            <br />
            <input type="checkbox" name={x} />
          </label>
        ))}
      </div>
      <ul style={{ fontSize: "1.5em", fontWeight: 700 }}>
        <li
          style={css(
            rs(any("a", "b", "c", "d", "e", "f"), {
              color: mutedColor,
            })
          )}
        >
          None selected
        </li>
        <li
          style={css(
            rs(not(any("a", "b", "c", "d", "e", "f")), {
              color: mutedColor,
            })
          )}
        >
          Any selected
        </li>
        <li
          style={css(
            rs(not(all("a", "b", "c", "d", "e", "f")), {
              color: mutedColor,
            })
          )}
        >
          All selected
        </li>
        <li
          style={css(
            rs(not(any(all("a", "b"), all("c", "d"), all("e", "f"))), {
              color: mutedColor,
            })
          )}
        >
          ab, cd, or ef selected
        </li>
        <li
          style={css(
            rs(
              not(
                any(
                  all("a", "b", "c", not(any("d", "e", "f"))),
                  all("d", "e", "f", not(any("a", "b", "c")))
                )
              ),
              {
                color: mutedColor,
              }
            )
          )}
        >
          abc xor def selected
        </li>
      </ul>
    </div>
  );
}
