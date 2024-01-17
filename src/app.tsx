import { buildHooksSystem } from "./lib/css-hooks";
import { stringifyValue } from "@css-hooks/react";

import { CSSProperties, useReducer } from "react";

const createHooks = buildHooksSystem<CSSProperties>(stringifyValue);

const [hooks, css] = createHooks({
  a: ".a &",
  b: ".b &",
  c: ".c &",
  d: ".d &",
  e: ".e &",
  f: ".f &",
  hover: "&:hover",
});

const mutedColor = "#999";

export function App() {
  const items = ["a", "b", "c", "d", "e", "f"] as const;
  type State = { [k in (typeof items)[number]]: boolean };

  const [state, dispatch] = useReducer(
    (state: State, action: Partial<State>) => ({ ...state, ...action }),
    { a: false, b: false, c: false, d: false, e: false, f: false }
  );

  return (
    <div
      className={Object.entries(state)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(" ")}
    >
      <style dangerouslySetInnerHTML={{ __html: hooks() }} />
      <div style={{ display: "flex" }}>
        {items.map((x) => (
          <label
            key={x}
            style={css([
              { textAlign: "center" },
              [x, { background: "black", color: "white" }],
              [{ and: ["hover", { not: x }] }, { background: "#ccc" }],
              [{ and: ["hover", x] }, { background: "#333" }],
            ])}
          >
            {x}
            <br />
            <input
              type="checkbox"
              checked={state[x]}
              onChange={(e) => dispatch({ [x]: e.target.checked })}
            />
          </label>
        ))}
      </div>
      <ul style={{ fontSize: "1.5em", fontWeight: 700 }}>
        <li
          style={css([
            [{ or: ["a", "b", "c", "d", "e", "f"] }, { color: mutedColor }],
          ])}
        >
          None selected
        </li>
        <li
          style={css([
            [
              { not: { or: ["a", "b", "c", "d", "e", "f"] } },
              { color: mutedColor },
            ],
          ])}
        >
          Any selected
        </li>
        <li
          style={css([
            [
              { not: { and: ["a", "b", "c", "d", "e", "f"] } },
              { color: mutedColor },
            ],
          ])}
        >
          All selected
        </li>
        <li
          style={css([
            [
              {
                not: {
                  or: [
                    { and: ["a", "b"] },
                    { and: ["c", "d"] },
                    { and: ["e", "f"] },
                  ],
                },
              },
              { color: mutedColor },
            ],
          ])}
        >
          ab, cd, or ef selected
        </li>
        <li
          style={css([
            [
              {
                not: {
                  or: [
                    { and: ["a", "b", "c", { not: { or: ["d", "e", "f"] } }] },
                    { and: ["d", "e", "f", { not: { or: ["a", "b", "c"] } }] },
                  ],
                },
              },
              { color: mutedColor },
            ],
          ])}
        >
          abc xor def selected
        </li>
      </ul>
    </div>
  );
}
