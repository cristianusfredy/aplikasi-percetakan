import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { AppProvider } from "./store/app-store"
import { ConfirmProvider } from "./components/confirm"
import { Toaster } from "./components/Toaster"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ConfirmProvider>
          <App />
          <Toaster />
        </ConfirmProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
