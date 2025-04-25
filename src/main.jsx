
// src/main.jsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);





// const isLoggedIn = localStorage.getItem("LOGIN") === "true";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <StrictMode>
//     <SomeContextProvider>
//       {isLoggedIn ? <App /> : <Login />}
//       </SomeContextProvider>
//     </StrictMode>
//   </BrowserRouter>
// );
// main.jsx
