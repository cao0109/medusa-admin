import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useHotkeys } from "react-hotkeys-hook"
import { Route, Routes, useNavigate } from "react-router-dom"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import Collections from "../domain/collections"
import Customers from "../domain/customers"
import Discounts from "../domain/discounts"
import GiftCards from "../domain/gift-cards"
import Guide from "../domain/guide"
import Inventory from "../domain/inventory"
import Oauth from "../domain/oauth"
import Orders from "../domain/orders"
import DraftOrders from "../domain/orders/draft-orders"
import PriceListRoute from "../domain/pricing"
import ProductCategories from "../domain/product-categories"
import ProductsRoute from "../domain/products"
import PublishableApiKeys from "../domain/publishable-api-keys"
import SalesChannels from "../domain/sales-channels"
import Settings from "../domain/settings"
import UsersPage from "../domain/users"

const IndexPage = () => {
  const navigate = useNavigate()
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))

  return (
    <PrivateRoute>
      <DashboardRoutes />
    </PrivateRoute>
  )
}

const DashboardRoutes = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO title="Medusa" />
        <Routes>
          <Route path="oauth/:app_name" element={<Oauth />} />
          <Route path="products/*" element={<ProductsRoute />} />
          <Route path="product-categories/*" element={<ProductCategories />} />
          <Route path="collections/*" element={<Collections />} />
          <Route path="gift-cards/*" element={<GiftCards />} />
          <Route path="orders/*" element={<Orders />} />
          <Route path="draft-orders/*" element={<DraftOrders />} />
          <Route path="discounts/*" element={<Discounts />} />
          <Route path="customers/*" element={<Customers />} />
          <Route path="pricing/*" element={<PriceListRoute />} />
          <Route path="users/*" element={<UsersPage />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="sales-channels/*" element={<SalesChannels />} />
          <Route
            path="publishable-api-keys/*"
            element={<PublishableApiKeys />}
          />
          <Route path="inventory/*" element={<Inventory />} />
          <Route path="guide/*" element={<Guide />} />
        </Routes>
      </Layout>
    </DndProvider>
  )
}

export default IndexPage
