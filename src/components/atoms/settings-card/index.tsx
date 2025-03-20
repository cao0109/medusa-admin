import React from "react"
import { Link } from "react-router-dom"
import ChevronRightIcon from "../../fundamentals/icons/chevron-right-icon"

type SettingsCardProps = {
  icon: React.ReactNode
  heading: string
  description: string
  to?: string
  externalLink?: string
  disabled?: boolean
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  icon,
  heading,
  description,
  to = null,
  externalLink = null,
  disabled = false,
}) => {
  if (disabled) {
    to = null
  }

  return (
    <Link to={to ?? ""} className="flex flex-1 items-center">
      <button
        className="group flex h-full flex-1 items-center rounded-rounded border border-grey-20 bg-grey-0 p-base"
        disabled={disabled}
        onClick={() => {
          if (externalLink) {
            window.location.href = externalLink
          }
        }}
      >
        <div className="flex h-2xlarge w-2xlarge items-center justify-center rounded-rounded border border-grey-20 bg-grey-0 text-grey-60 group-disabled:bg-grey-10 group-disabled:text-grey-40">
          <div className="flex h-xlarge w-xlarge items-center justify-center overflow-hidden rounded-md bg-grey-10">
            {icon}
          </div>
        </div>
        <div className="mx-large flex-1 text-left">
          <h3 className="inter-large-semibold m-0 text-grey-90 group-disabled:text-grey-40">
            {heading}
          </h3>
          <p className="inter-base-regular m-0 text-grey-50 group-disabled:text-grey-40">
            {description}
          </p>
        </div>
        <div className="text-grey-40 group-disabled:text-grey-30">
          <ChevronRightIcon />
        </div>
      </button>
    </Link>
  )
}

export default SettingsCard
