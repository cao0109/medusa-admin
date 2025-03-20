import ReactDOM from "react-dom/client"

import "./i18n"

import App from "./App"
import { Providers } from "./providers/providers"

import "./assets/styles/global.css"

async function run() {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Providers>
      <App />
    </Providers>
  )
}

run()
