import { ExclamationCircle, Spinner } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import { useAdminPriceList } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import Spacer from "../../../components/atoms/spacer"
import { PriceListGeneralSection } from "./details"
import { PriceListPricesSection } from "./prices"

const PriceListEdit = () => {
  const { id } = useParams<{ id: string }>()

  const { t } = useTranslation()

  const { price_list, isLoading, isError } = useAdminPriceList(id!, {
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <Container className="flex min-h-[320px] items-center justify-center">
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </Container>
    )
  }

  if (isError || !price_list) {
    return (
      <Container className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            {t(
              "price-list-edit-error",
              "An error occurred while loading price list. Reload the page and try again. If the issue persists, try again later."
            )}
          </Text>
        </div>
      </Container>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <PriceListGeneralSection
          key={`gs_${price_list.id}_${price_list.updated_at}`}
          priceList={price_list}
        />
        <PriceListPricesSection
          key={`ps_${price_list.id}_${price_list.updated_at}`}
          priceList={price_list}
        />

        <Spacer />
      </div>
    </>
  )
}

export { PriceListEdit }
