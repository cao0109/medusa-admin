import React from "react"
import PageDescription from "../atoms/page-description"

const SettingsOverview: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <PageDescription
        title={"Settings"}
        subtitle={"Manage the settings for your Medusa store"}
      />
      <div className="grid auto-cols-fr grid-cols-1 gap-x-base gap-y-xsmall medium:grid-cols-2">
        {children}
      </div>
    </div>
  )
}

export default SettingsOverview
