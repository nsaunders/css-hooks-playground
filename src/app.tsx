import { buildHooksSystem } from "./lib/css-hooks";
import { stringifyValue } from "@css-hooks/react";
import { select, all, any, not } from "./lib/css-hooks/helpers";

import { CSSProperties } from "react";

const createHooks = buildHooksSystem<CSSProperties>(stringifyValue);

const [hooks, css] = createHooks({
  a: ":has([name='a']:checked) &",
  b: ":has([name='b']:checked) &",
  c: ":has([name='c']:checked) &",
  d: ":has([name='d']:checked) &",
  e: ":has([name='e']:checked) &",
  f: ":has([name='f']:checked) &",
  hover: all("&:hover", "@media (hover:hover)"),
});

const mutedColor = "#999";

export function App() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: hooks() }} />
      <div style={{ display: "flex" }}>
        {(["a", "b", "c", "d", "e", "f"] as const).map((x) => (
          <label
            key={x}
            style={css(
              select({
                textAlign: "center",
              }).always,
              select({
                background: "black",
                color: "white",
              }).where(x),
              select({
                background: "#ccc",
              }).where(all("hover", not(x))),
              select({
                background: "#333",
              }).where(all("hover", x))
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
            select({
              color: mutedColor,
            }).where(any("a", "b", "c", "d", "e", "f"))
          )}
        >
          None selected
        </li>
        <li
          style={css(
            select({
              color: mutedColor,
            }).where(not(any("a", "b", "c", "d", "e", "f")))
          )}
        >
          Any selected
        </li>
        <li
          style={css(
            select({ color: mutedColor }).where(
              not(all("a", "b", "c", "d", "e", "f"))
            )
          )}
        >
          All selected
        </li>
        <li
          style={css(
            select({ color: mutedColor }).where(
              not(any(all("a", "b"), all("c", "d"), all("e", "f")))
            )
          )}
        >
          ab, cd, or ef selected
        </li>
        <li
          style={css(
            select({ color: mutedColor }).where(
              not(
                any(
                  all("a", "b", "c", not(any("d", "e", "f"))),
                  all("d", "e", "f", not(any("a", "b", "c")))
                )
              )
            )
          )}
        >
          abc xor def selected
        </li>
      </ul>
    </div>
  );
}
