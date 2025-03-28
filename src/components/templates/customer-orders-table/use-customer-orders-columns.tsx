import { Order } from "@medusajs/medusa"
import moment from "moment"
import { useMemo, useRef } from "react"
import { Column } from "react-table"
import { useTranslation } from "react-i18next"
import { useObserveWidth } from "../../../hooks/use-observe-width"
import { stringDisplayPrice } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import { TFunction } from "i18next"

const decidePaymentStatus = (status: string, t: TFunction) => {
  switch (status) {
    case "captured":
      return (
        <StatusIndicator
          variant="success"
          title={t("customer-orders-table-paid", "Paid")}
        />
      )
    case "awaiting":
      return (
        <StatusIndicator
          variant="warning"
          title={t("customer-orders-table-awaiting", "Awaiting")}
        />
      )
    case "requires":
      return (
        <StatusIndicator
          variant="danger"
          title={t("customer-orders-table-requires-action", "Requires action")}
        />
      )
    default:
      return (
        <StatusIndicator
          variant="primary"
          title={t("customer-orders-table-n-a", "N/A")}
        />
      )
  }
}

const decideFulfillmentStatus = (status: string, t: TFunction) => {
  switch (status) {
    case "fulfilled":
      return (
        <StatusIndicator
          variant="success"
          title={t("customer-orders-table-fulfilled", "Fulfilled")}
        />
      )
    case "shipped":
      return (
        <StatusIndicator
          variant="success"
          title={t("customer-orders-table-shipped", "Shipped")}
        />
      )
    case "not_fulfilled":
      return (
        <StatusIndicator
          variant="default"
          title={t("customer-orders-table-not-fulfilled", "Not fulfilled")}
        />
      )
    case "partially_fulfilled":
      return (
        <StatusIndicator
          variant="warning"
          title={t(
            "customer-orders-table-partially-fulfilled",
            "Partially fulfilled"
          )}
        />
      )
    case "partially_shipped":
      return (
        <StatusIndicator
          variant="warning"
          title={t(
            "customer-orders-table-partially-shipped",
            "Partially shipped"
          )}
        />
      )
    case "requires":
      return (
        <StatusIndicator
          variant="danger"
          title={t("customer-orders-table-requires-action", "Requires action")}
        />
      )
    default:
      return (
        <StatusIndicator
          variant="primary"
          title={t("customer-orders-table-n-a", "N/A")}
        />
      )
  }
}

export const useCustomerOrdersColumns = (): Column<Order>[] => {
  const { t } = useTranslation()
  const columns = useMemo(() => {
    return [
      {
        Header: t("customer-orders-table-order", "Order"),
        accessor: "display_id",
        Cell: ({ value }) => {
          return <span className="text-grey-90">#{value}</span>
        },
      },
      {
        accessor: "items",
        Cell: ({ value }) => {
          const containerRef = useRef<HTMLDivElement>(null)
          const width = useObserveWidth(containerRef)

          const { visibleItems, remainder } = useMemo(() => {
            if (!value || value.length === 0) {
              return { visibleItems: [], remainder: 0 }
            }

            const columns = Math.max(Math.floor(width / 20) - 1, 1)
            const visibleItems = value.slice(0, columns)
            const remainder = value.length - columns

            return { visibleItems, remainder }
          }, [value, width])

          if (!value) {
            return null
          }

          return (
            <div className="flex items-center gap-x-2xsmall">
              <div ref={containerRef} className="flex gap-x-xsmall">
                {visibleItems.map((item) => {
                  return (
                    <Tooltip content={item.title} key={item.id}>
                      <div className="flex h-[35px] w-[25px] items-center justify-center overflow-hidden rounded-rounded">
                        {item.thumbnail ? (
                          <img
                            className="object-cover"
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </div>
                    </Tooltip>
                  )
                })}
              </div>
              {remainder > 0 && (
                <span className="inter-small-regular text-grey-40">
                  {t(
                    "customer-orders-table-remainder-more",
                    "+ {{remainder}} more",
                    { remainder }
                  )}
                </span>
              )}
            </div>
          )
        },
      },
      {
        Header: t("customer-orders-table-date", "Date"),
        accessor: "created_at",
        Cell: ({ value }) => {
          return moment(value).format("DD MMM YYYY hh:mm")
        },
      },
      {
        Header: t("customer-orders-table-fulfillment", "Fulfillment"),
        accessor: "fulfillment_status",
        Cell: ({ value }) => {
          return decideFulfillmentStatus(value, t)
        },
      },
      {
        Header: t("customer-orders-table-status", "Status"),
        accessor: "payment_status",
        Cell: ({ value }) => {
          return decidePaymentStatus(value, t)
        },
      },
      {
        Header: () => (
          <div className="text-right">
            {t("customer-orders-table-total", "Total")}
          </div>
        ),
        accessor: "total",
        Cell: ({
          value,
          row: {
            original: { currency_code },
          },
        }) => {
          return (
            <div className="text-right">
              {stringDisplayPrice({
                amount: value,
                currencyCode: currency_code,
              })}
            </div>
          )
        },
      },
    ] as Column<Order>[]
  }, [])

  return columns
}
