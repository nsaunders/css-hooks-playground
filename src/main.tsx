import { App } from "./app.jsx";
import { createRoot } from "react-dom/client";

const el = document.getElementById("host");
if (el) {
  createRoot(el).render(<App />);
}
