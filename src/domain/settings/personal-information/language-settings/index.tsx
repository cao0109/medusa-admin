import { useTranslation } from "react-i18next"
import LanguageMenu from "./language-menu"

const LanguageSettings = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center gap-x-xsmall">
            <h2 className="inter-base-semibold">
              {t("personal-information-language-settings-title", "Language")}
            </h2>
          </div>
          <p className="inter-base-regular text-grey-50">
            {t(
              "personal-information-language-settings-description",
              "Adjust the language of Medusa Admin"
            )}
          </p>
        </div>
        <LanguageMenu />
      </div>
    </>
  )
}

export default LanguageSettings
