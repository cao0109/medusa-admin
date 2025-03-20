import React from "react"
import { useTranslation } from "react-i18next"
import { Route, Routes } from "react-router-dom"
import SettingsCard from "../../components/atoms/settings-card"
import Spacer from "../../components/atoms/spacer"
import FeatureToggle from "../../components/fundamentals/feature-toggle"
import ArrowUTurnLeft from "../../components/fundamentals/icons/arrow-uturn-left"
import ChannelsIcon from "../../components/fundamentals/icons/channels-icon"
import CoinsIcon from "../../components/fundamentals/icons/coins-icon"
import CrosshairIcon from "../../components/fundamentals/icons/crosshair-icon"
import GearIcon from "../../components/fundamentals/icons/gear-icon"
import HappyIcon from "../../components/fundamentals/icons/happy-icon"
import KeyIcon from "../../components/fundamentals/icons/key-icon"
import MapPinIcon from "../../components/fundamentals/icons/map-pin-icon"
import TaxesIcon from "../../components/fundamentals/icons/taxes-icon"
import UsersIcon from "../../components/fundamentals/icons/users-icon"
import CurrencySettings from "./currencies"
import Details from "./details"
import PersonalInformation from "./personal-information"
import Regions from "./regions"
import ReturnReasons from "./return-reasons"
import Taxes from "./taxes"
import Users from "./users"

type SettingsCardType = {
  heading: string
  description: string
  icon?: React.ComponentType
  to: string
  feature_flag?: string
}

const settings: SettingsCardType[] = [
  {
    heading: "API Key Management",
    description: "Create and manage API keys",
    icon: KeyIcon,
    to: "/a/publishable-api-keys",
    feature_flag: "publishable_api_keys",
  },
  {
    heading: "Currencies",
    description: "Manage the currencies of your store",
    icon: CoinsIcon,
    to: "/a/settings/currencies",
  },
  {
    heading: "Personal Information",
    description: "Manage your Medusa profile",
    icon: HappyIcon,
    to: "/a/settings/personal-information",
  },
  {
    heading: "Regions",
    description: "Manage shipping, payment, and fulfillment across regions",
    icon: MapPinIcon,
    to: "/a/settings/regions",
  },
  {
    heading: "Return Reasons",
    description: "Manage reasons for returned items",
    icon: ArrowUTurnLeft,
    to: "/a/settings/return-reasons",
  },
  {
    heading: "Sales Channels",
    description: "Control which product are available in which channels",
    icon: ChannelsIcon,
    feature_flag: "sales_channels",
    to: "/a/sales-channels",
  },
  {
    heading: "Store Details",
    description: "Manage your business details",
    icon: CrosshairIcon,
    to: "/a/settings/details",
  },
  {
    heading: "Taxes",
    description: "Manage taxes across regions and products",
    icon: TaxesIcon,
    to: "/a/settings/taxes",
  },
  {
    heading: "The Team",
    description: "Manage users of your Medusa Store",
    icon: UsersIcon,
    to: "/a/settings/team",
  },
]

const renderCard = ({
  heading,
  description,
  icon,
  to,
  feature_flag,
}: SettingsCardType) => {
  const Icon = icon || GearIcon

  const card = (
    <SettingsCard
      heading={heading}
      description={description}
      icon={<Icon />}
      to={to}
    />
  )

  if (feature_flag) {
    return <FeatureToggle featureFlag={feature_flag}>{card}</FeatureToggle>
  }

  return card
}

const SettingsIndex = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-xlarge">
      <div className="flex flex-col gap-y-large">
        <div className="flex flex-col gap-y-2xsmall">
          <h2 className="inter-xlarge-semibold">General</h2>
          <p className="inter-base-regular text-grey-50">
            {t(
              "settings-manage-the-general-settings-for-your-store",
              "Manage the general settings for your store"
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-xsmall gap-x-4 medium:grid-cols-2">
          {settings.map((s) => renderCard(s))}
        </div>
      </div>

      <Spacer />
    </div>
  )
}

const Settings = () => {
  return (
    <Routes>
      <Route index element={<SettingsIndex />} />
      <Route path="/details" element={<Details />} />
      <Route path="/regions/*" element={<Regions />} />
      <Route path="/currencies" element={<CurrencySettings />} />
      <Route path="/return-reasons" element={<ReturnReasons />} />
      <Route path="/team" element={<Users />} />
      <Route path="/personal-information" element={<PersonalInformation />} />
      <Route path="/taxes/*" element={<Taxes />} />
    </Routes>
  )
}

export default Settings
