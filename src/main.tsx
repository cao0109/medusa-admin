import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import "./i18n"
import MedusaApp from "./medusa-app"

async function run() {
  const app = new MedusaApp({ entries: [] })

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
