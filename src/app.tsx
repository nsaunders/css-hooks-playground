import { buildHooksSystem } from "./lib/css-hooks";
import { stringifyValue } from "@css-hooks/react";

import { CSSProperties } from "react";

const createHooks = buildHooksSystem<CSSProperties>(stringifyValue);

const [hooks, css] = createHooks({
  a: ":has([name='a']:checked) &",
  b: ":has([name='b']:checked) &",
  c: ":has([name='c']:checked) &",
  d: ":has([name='d']:checked) &",
  e: ":has([name='e']:checked) &",
  f: ":has([name='f']:checked) &",
  hover: "&:hover",
});

const mutedColor = "#999";

export function App() {
  console.log("No re-renders");
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: hooks() }} />
      <div style={{ display: "flex" }}>
        {(["a", "b", "c", "d", "e", "f"] as const).map((x) => (
          <label
            key={x}
            style={css(
              {
                textAlign: "center",
              },
              [
                x,
                {
                  background: "black",
                  color: "white",
                },
              ],
              [
                { and: ["hover", { not: x }] },
                {
                  background: "#ccc",
                },
              ],
              [
                { and: ["hover", x] },
                {
                  background: "#333",
                },
              ]
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
          style={css([
            { or: ["a", "b", "c", "d", "e", "f"] },
            {
              color: mutedColor,
            },
          ])}
        >
          None selected
        </li>
        <li
          style={css([
            { not: { or: ["a", "b", "c", "d", "e", "f"] } },
            {
              color: mutedColor,
            },
          ])}
        >
          Any selected
        </li>
        <li
          style={css([
            { not: { and: ["a", "b", "c", "d", "e", "f"] } },
            {
              color: mutedColor,
            },
          ])}
        >
          All selected
        </li>
        <li
          style={css([
            {
              not: {
                or: [
                  { and: ["a", "b"] },
                  { and: ["c", "d"] },
                  { and: ["e", "f"] },
                ],
              },
            },
            {
              color: mutedColor,
            },
          ])}
        >
          ab, cd, or ef selected
        </li>
        <li
          style={css([
            {
              not: {
                or: [
                  { and: ["a", "b", "c", { not: { or: ["d", "e", "f"] } }] },
                  { and: ["d", "e", "f", { not: { or: ["a", "b", "c"] } }] },
                ],
              },
            },
            {
              color: mutedColor,
            },
          ])}
        >
          abc xor def selected
        </li>
      </ul>
    </div>
  );
}
