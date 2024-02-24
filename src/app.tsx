import { createHooks } from "@css-hooks/react";

const { styleSheet, css } = createHooks({
  hooks: {
    a: ":has([name='a']:checked) &",
    b: ":has([name='b']:checked) &",
    c: ":has([name='c']:checked) &",
    d: ":has([name='d']:checked) &",
    e: ":has([name='e']:checked) &",
    f: ":has([name='f']:checked) &",
    hover: { and: ["&:hover", "@media (hover:hover)"] },
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
              on: ($, { and, not }) => [
                $(x, {
                  background: "black",
                  color: "white",
                }),
                $(and("hover", not(x)), {
                  background: "#ccc",
                }),
                $(and("hover", x), {
                  background: "#333",
                }),
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
            on: ($, { or }) => [
              $(or("a", "b", "c", "d", "e", "f"), {
                color: mutedColor,
              }),
            ],
          })}
        >
          None selected
        </li>
        <li
          style={css({
            on: ($, { not, or }) => [
              [
                not(or("a", "b", "c", "d", "e", "f")),
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
            on: ($, { and, not }) => [
              [
                not(and("a", "b", "c", "d", "e", "f")),
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
            on: ($, { and, not, or }) => [
              $(not(or(and("a", "b"), and("c", "d"), and("e", "f"))), {
                color: mutedColor,
              }),
            ],
          })}
        >
          ab, cd, or ef selected
        </li>
        <li
          style={css({
            on: ($, { and, or, not }) => [
              $(
                not(
                  or(
                    and("a", "b", "c", not(or("d", "e", "f"))),
                    and("d", "e", "f", not(or("a", "b", "c")))
                  )
                ),
                {
                  color: mutedColor,
                }
              ),
            ],
          })}
        >
          abc xor def selected
        </li>
      </ul>
    </div>
  );
}
