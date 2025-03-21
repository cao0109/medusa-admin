import { lazy, Suspense } from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import Spinner from "./components/atoms/spinner"
import { WRITE_KEY } from "./constants/analytics"
import { AnalyticsProvider } from "./providers/analytics-provider"

const NotFound = lazy(() => import("./pages/404"))
const Dashboard = lazy(() => import("./pages/a"))
const IndexPage = lazy(() => import("./pages/index"))
const InvitePage = lazy(() => import("./pages/invite"))
const LoginPage = lazy(() => import("./pages/login"))
const ResetPasswordPage = lazy(() => import("./pages/reset-password"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<IndexPage />} />
      <Route
        path="a/*"
        element={
          <AnalyticsProvider writeKey={WRITE_KEY}>
            <Dashboard />
          </AnalyticsProvider>
        }
      />
      <Route
        path="invite"
        element={
          <AnalyticsProvider writeKey={WRITE_KEY}>
            <InvitePage />
          </AnalyticsProvider>
        }
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
)

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-grey-5 text-grey-90">
    <Spinner variant="secondary" />
  </div>
)

const App = () => (
  <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
  </Suspense>
)

export default App
