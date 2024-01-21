import { buildHooksSystem } from "./lib/css-hooks";
import { stringifyValue } from "@css-hooks/react";

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
    hover: { all: ["&:hover", "@media (hover:hover)"] },
  },
  debug: true,
  sort: {
    conditionalStyles: true,
    properties: true,
  },
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
            style={css({
              textAlign: "center",
              on: [
                [
                  x,
                  {
                    background: "black",
                    color: "white",
                  },
                ],
                [
                  { all: ["hover", { not: x }] },
                  {
                    background: "#ccc",
                  },
                ],
                [
                  { all: ["hover", x] },
                  {
                    background: "#333",
                  },
                ],
              ],
            })}
          >
            {x}
            <br />
            <input type="checkbox" name={x} />
          </label>
        ))}
      </div>
      <ul style={{ fontSize: "1.5em", fontWeight: 700 }}>
        <li
          style={css({
            on: [
              [
                { any: ["a", "b", "c", "d", "e", "f"] },
                {
                  color: mutedColor,
                },
              ],
            ],
          })}
        >
          None selected
        </li>
        <li
          style={css({
            on: [
              [
                { not: { any: ["a", "b", "c", "d", "e", "f"] } },
                {
                  color: mutedColor,
                },
              ],
            ],
          })}
        >
          Any selected
        </li>
        <li
          style={css({
            on: [
              [
                { not: { all: ["a", "b", "c", "d", "e", "f"] } },
                {
                  color: mutedColor,
                },
              ],
            ],
          })}
        >
          All selected
        </li>
        <li
          style={css({
            on: [
              [
                {
                  not: {
                    any: [
                      { all: ["a", "b"] },
                      { all: ["c", "d"] },
                      { all: ["e", "f"] },
                    ],
                  },
                },
                {
                  color: mutedColor,
                },
              ],
            ],
          })}
        >
          ab, cd, or ef selected
        </li>
        <li
          style={css({
            on: [
              [
                {
                  not: {
                    any: [
                      {
                        all: ["a", "b", "c", { not: { any: ["d", "e", "f"] } }],
                      },
                      {
                        all: ["d", "e", "f", { not: { any: ["a", "b", "c"] } }],
                      },
                    ],
                  },
                },
                {
                  color: mutedColor,
                },
              ],
            ],
          })}
        >
          abc xor def selected
        </li>
      </ul>
    </div>
  );
}
