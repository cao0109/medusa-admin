import { useAdminGetSession } from "medusa-react"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import EditUserInformation from "./edit-user-information"
import UsageInsights from "./usage-insights"
import LanguageSettings from "./language-settings"

const PersonalInformation = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { user } = useAdminGetSession()
  const { t } = useTranslation()

  return (
    <div>
      <BackButton
        label={t("personal-information-back-to-settings", "Back to Settings")}
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="flex flex-col gap-y-xlarge rounded-rounded border border-grey-20 bg-white px-xlarge pt-large pb-xlarge large:max-w-[50%]">
        <div className="flex flex-col gap-y-2xsmall">
          <h1 className="inter-xlarge-semibold">
            {t(
              "personal-information-personal-information",
              "Personal information"
            )}
          </h1>
          <p className="inter-base-regular text-grey-50">
            {t(
              "personal-information-manage-your-medusa-profile",
              "Manage your Medusa profile"
            )}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="border-t border-grey-20 py-xlarge">
            <EditUserInformation user={user} />
          </div>
          <div className="border-t border-grey-20 py-xlarge">
            <LanguageSettings />
          </div>
          {isFeatureEnabled("analytics") && (
            <div className="border-t border-grey-20 py-xlarge">
              <UsageInsights user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation
