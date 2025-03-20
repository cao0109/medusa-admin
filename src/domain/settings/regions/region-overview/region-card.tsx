import { Region } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import RadioGroup from "../../../../components/organisms/radio-group"
import fulfillmentProvidersMapper from "../../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../../utils/payment-providers-mapper"

type Props = {
  region: Region
}

const RegionCard = ({ region }: Props) => {
  const { t } = useTranslation()
  return (
    <RadioGroup.Item
      value={region.id}
      label={region.name}
      sublabel={
        region.countries && region.countries.length
          ? `(${region.countries.map((c) => c.display_name).join(", ")})`
          : undefined
      }
    >
      <div className="inter-small-regular flex flex-col gap-y-2xsmall text-grey-50">
        <p>
          Payment providers:{" "}
          <span className="truncate">
            {region.payment_providers?.length
              ? region.payment_providers
                  .map((pp) => paymentProvidersMapper(pp.id).label)
                  .join(", ")
              : t("region-overview-not-configured", "Not configured")}
          </span>
        </p>
        <p>
          {t("region-overview-fulfillment-providers", "Fulfillment providers:")}{" "}
          <span className="truncate">
            {region.fulfillment_providers?.length
              ? region.fulfillment_providers
                  .map((fp) => fulfillmentProvidersMapper(fp.id).label)
                  .join(", ")
              : t("region-overview-not-configured", "Not configured")}
          </span>
        </p>
      </div>
    </RadioGroup.Item>
  )
}

export default RegionCard
