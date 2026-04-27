import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainRouter } from "./router";
import { ThemeProvider } from "@mui/material";
import { MuiTheme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";

// MuiTheme is a function, need to call it to get the theme object
const theme = MuiTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MainRouter />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
