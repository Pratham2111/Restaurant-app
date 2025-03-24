import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Create root and render app
const root = createRoot(document.getElementById("root"));
root.render(<App />);