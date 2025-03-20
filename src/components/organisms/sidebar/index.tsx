import { useAdminGetSession, useAdminStore } from "medusa-react"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  BookOpen,
  Buildings,
  CogSixTooth,
  CurrencyDollar,
  Gift,
  ReceiptPercent,
  ShoppingCart,
  Swatch,
  Tag,
  UserGroup,
  Users,
} from "@medusajs/icons"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import SidebarMenuItem from "../../molecules/sidebar-menu-item"
import UserMenu from "../../molecules/user-menu"

const ICON_SIZE = 20

const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)

  const { isFeatureEnabled } = useFeatureFlag()
  const { store } = useAdminStore()
  const { user, isLoading } = useAdminGetSession()

  const triggerHandler = () => {
    const id = triggerHandler.id++
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    }
  }
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0

  const inventoryEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  return (
    <div className="bg-gray-0 h-screen min-w-sidebar max-w-sidebar overflow-y-auto border-r border-grey-20 py-base px-base">
      <div className="h-full">
        <div className="flex justify-between px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-circle border border-solid border-gray-300">
            <UserMenu />
          </div>
        </div>
        <div className="my-base flex flex-col px-2">
          <span className="text-small font-medium text-grey-50">
            {t("sidebar-store", "Store")}
          </span>
          <span className="text-medium font-medium text-grey-90">
            {store?.name}
          </span>
        </div>
        <div className="py-3.5">
          {!isLoading && user?.permission !== "admin" && (
            <SidebarMenuItem
              pageLink={"/a/guide"}
              icon={<BookOpen />}
              triggerHandler={triggerHandler}
              text={t("sidebar-guides", "Guide")}
            />
          )}
          <SidebarMenuItem
            pageLink={"/a/orders"}
            icon={<ShoppingCart />}
            triggerHandler={triggerHandler}
            text={t("sidebar-orders", "Orders")}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<Tag />}
            text={t("sidebar-products", "Products")}
            triggerHandler={triggerHandler}
          />
          {isFeatureEnabled("product_categories") && (
            <SidebarMenuItem
              pageLink={"/a/product-categories"}
              icon={<Swatch />}
              text={t("sidebar-categories", "Categories")}
              triggerHandler={triggerHandler}
            />
          )}
          <SidebarMenuItem
            pageLink={"/a/customers"}
            icon={<Users />}
            triggerHandler={triggerHandler}
            text={t("sidebar-customers", "Customers")}
          />
          {inventoryEnabled && (
            <SidebarMenuItem
              pageLink={"/a/inventory"}
              icon={<Buildings />}
              triggerHandler={triggerHandler}
              text={t("sidebar-inventory", "Inventory")}
            />
          )}
          <SidebarMenuItem
            pageLink={"/a/discounts"}
            icon={<ReceiptPercent />}
            triggerHandler={triggerHandler}
            text={t("sidebar-discounts", "Discounts")}
          />
          <SidebarMenuItem
            pageLink={"/a/gift-cards"}
            icon={<Gift />}
            triggerHandler={triggerHandler}
            text={t("sidebar-gift-cards", "Gift Cards")}
          />
          <SidebarMenuItem
            pageLink={"/a/pricing"}
            icon={<CurrencyDollar />}
            triggerHandler={triggerHandler}
            text={t("sidebar-pricing", "Pricing")}
          />
          <SidebarMenuItem
            pageLink={"/a/users"}
            icon={<UserGroup />}
            triggerHandler={triggerHandler}
            text={t("sidebar-users", "Users")}
          />
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<CogSixTooth />}
            triggerHandler={triggerHandler}
            text={t("sidebar-settings", "Settings")}
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
