import { LineItem } from "@medusajs/medusa"
import { ReservationItemDTO } from "@medusajs/types"

import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import ReservationIndicator from "../../components/reservation-indicator/reservation-indicator"

type OrderLineProps = {
  item: LineItem
  currencyCode: string
  reservations?: ReservationItemDTO[]
  isAllocatable?: boolean
}

const OrderLine = ({
  item,
  currencyCode,
  reservations,
  isAllocatable = true,
}: OrderLineProps) => {
  const { isFeatureEnabled } = useFeatureFlag()
  return (
    <div className="mx-[-5px] mb-1 flex h-[64px] justify-between rounded-rounded py-2 px-[5px] hover:bg-grey-5">
      <div className="flex justify-center space-x-4">
        <div className="flex h-[48px] w-[36px] overflow-hidden rounded-rounded">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[185px] flex-col justify-center">
          <span className="inter-small-regular truncate text-grey-90">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular truncate text-grey-50">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-3 flex small:space-x-2 medium:space-x-4 large:space-x-6">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: (item?.total ?? 0) / item.quantity,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
          <div className="inter-small-regular text-grey-50">
            x {item.quantity}
          </div>
          {isFeatureEnabled("inventoryService") && isAllocatable && (
            <ReservationIndicator reservations={reservations} lineItem={item} />
          )}
          <div className="inter-small-regular min-w-[55px] text-right text-grey-90">
            {formatAmountWithSymbol({
              amount: item.total ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default OrderLine
