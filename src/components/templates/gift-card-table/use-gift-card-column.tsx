import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { formatAmountWithSymbol } from "../../../utils/prices"
import StatusIndicator from "../../fundamentals/status-indicator"
import IconTooltip from "../../molecules/icon-tooltip"
import Table from "../../molecules/table"

const useGiftCardTableColums = () => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">{t("gift-card-table-code", "Code")}</div>,
        accessor: "code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="w-[20%] pl-2 text-grey-90 group-hover:text-violet-60"
          >
            {value}
          </Table.Cell>
        ),
      },
      {
        Header: t("gift-card-table-order", "Order"),
        accessor: "order",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="w-[10%] pl-2 text-grey-90 group-hover:text-violet-60"
          >
            {value && value?.display_id ? (
              `#${value.display_id}`
            ) : (
              <span className="text-grey-90">-</span>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: t("gift-card-table-original-amount", "Original Amount"),
        accessor: "value",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {row.original.region ? (
              formatAmountWithSymbol({
                amount: value,
                currency: row.original.region.currency_code,
              })
            ) : (
              <div className="flex items-center space-x-2">
                <span>N / A</span>
                <IconTooltip content={"Region has been deleted"} />
              </div>
            )}
          </Table.Cell>
        ),
      },
      {
        Header: t("gift-card-table-balance", "Balance"),
        accessor: "balance",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {value ? (
              row.original.region ? (
                formatAmountWithSymbol({
                  amount: value,
                  currency: row.original.region.currency_code,
                })
              ) : (
                <div className="flex items-center space-x-2">
                  <span>N / A</span>
                  <IconTooltip
                    content={t(
                      "gift-card-table-region-has-been-deleted",
                      "Region has been deleted"
                    )}
                  />
                </div>
              )
            ) : (
              <StatusIndicator
                title={t("gift-card-table-none", "None")}
                variant="danger"
              />
            )}
          </Table.Cell>
        ),
      },
      {
        Header: () => (
          <div className="flex w-full justify-end rounded-rounded pr-2">
            {t("gift-card-table-created", "Created")}
          </div>
        ),
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell className="pr-2" key={index}>
            <div className="flex w-full justify-end rounded-rounded">
              {moment(value).format("MMM Do YYYY")}
            </div>
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useGiftCardTableColums
