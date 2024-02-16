import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material";

axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: { fontFamily: "Poppins,serif", allVariants: { color: "white" } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="bottom-left" />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
