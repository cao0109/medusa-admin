import {
  AdminGetVariantsVariantInventoryRes,
  Order,
  VariantInventory,
} from "@medusajs/medusa"
import React, { useContext, useMemo } from "react"
import { DisplayTotal, PaymentDetails } from "../templates"
import { useTranslation } from "react-i18next"

import { ActionType } from "../../../../components/molecules/actionables"
import Badge from "../../../../components/fundamentals/badge"
import BodyCard from "../../../../components/organisms/body-card"
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"
import { OrderEditContext } from "../../edit/context"
import OrderLine from "../order-line"
import { ReservationItemDTO } from "@medusajs/types"
import ReserveItemsModal from "../reservation/reserve-items-modal"
import { Response } from "@medusajs/medusa-js"
import { sum } from "lodash"
import { useMedusa } from "medusa-react"
import StatusIndicator from "../../../../components/fundamentals/status-indicator"
import useToggleState from "../../../../hooks/use-toggle-state"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"

type SummaryCardProps = {
  order: Order
  reservations: ReservationItemDTO[]
}

const SummaryCard: React.FC<SummaryCardProps> = ({ order, reservations }) => {
  const { t } = useTranslation()
  const {
    state: reservationModalIsOpen,
    open: showReservationModal,
    close: closeReservationModal,
  } = useToggleState()

  const { showModal } = useContext(OrderEditContext)
  const { client } = useMedusa()
  const { isFeatureEnabled } = useFeatureFlag()
  const inventoryEnabled = isFeatureEnabled("inventoryService")

  const [variantInventoryMap, setVariantInventoryMap] = React.useState<
    Map<string, VariantInventory>
  >(new Map())

  React.useEffect(() => {
    if (!inventoryEnabled) {
      return
    }

    const fetchInventory = async () => {
      const inventory = await Promise.all(
        order.items.map(async (item) => {
          if (!item.variant_id) {
            return
          }
          return await client.admin.variants.getInventory(item.variant_id)
        })
      )

      setVariantInventoryMap(
        new Map(
          inventory
            .filter(
              (
                inventoryItem
                // eslint-disable-next-line max-len
              ): inventoryItem is Response<AdminGetVariantsVariantInventoryRes> =>
                !!inventoryItem
            )
            .map((i) => {
              return [i.variant.id, i.variant]
            })
        )
      )
    }

    fetchInventory()
  }, [order.items, inventoryEnabled, client.admin.variants])

  const reservationItemsMap = useMemo(() => {
    if (!reservations?.length || !inventoryEnabled) {
      return {}
    }

    return reservations.reduce(
      (acc: Record<string, ReservationItemDTO[]>, item: ReservationItemDTO) => {
        if (!item.line_item_id) {
          return acc
        }
        acc[item.line_item_id] = acc[item.line_item_id]
          ? [...acc[item.line_item_id], item]
          : [item]
        return acc
      },
      {}
    )
  }, [reservations, inventoryEnabled])

  const allItemsReserved = useMemo(() => {
    return order.items.every((item) => {
      if (
        !item.variant_id ||
        !variantInventoryMap.get(item.variant_id)?.inventory.length
      ) {
        return true
      }

      const reservations = reservationItemsMap[item.id]

      return (
        item.quantity === item.fulfilled_quantity ||
        (reservations &&
          sum(reservations.map((r) => r.quantity)) ===
            item.quantity - (item.fulfilled_quantity || 0))
      )
    })
  }, [order.items, variantInventoryMap, reservationItemsMap])

  const { hasMovements, swapAmount, manualRefund, swapRefund, returnRefund } =
    useMemo(() => {
      let manualRefund = 0
      let swapRefund = 0
      let returnRefund = 0

      const swapAmount = sum(order?.swaps.map((s) => s.difference_due) || [0])

      if (order?.refunds?.length) {
        order.refunds.forEach((ref) => {
          if (ref.reason === "other" || ref.reason === "discount") {
            manualRefund += ref.amount
          }
          if (ref.reason === "return") {
            returnRefund += ref.amount
          }
          if (ref.reason === "swap") {
            swapRefund += ref.amount
          }
        })
      }
      return {
        hasMovements:
          swapAmount + manualRefund + swapRefund + returnRefund !== 0,
        swapAmount,
        manualRefund,
        swapRefund,
        returnRefund,
      }
    }, [order])

  const actionables = useMemo(() => {
    const actionables: ActionType[] = []
    if (isFeatureEnabled("order_editing")) {
      actionables.push({
        label: t("detail-cards-edit-order", "Edit Order"),
        onClick: showModal,
      })
    }
    if (isFeatureEnabled("inventoryService") && !allItemsReserved) {
      actionables.push({
        label: t("detail-cards-allocate", "Allocate"),
        onClick: showReservationModal,
      })
    }
    return actionables
  }, [showModal, isFeatureEnabled, showReservationModal, allItemsReserved])

  const isAllocatable = !["canceled", "archived"].includes(order.status)

  return (
    <BodyCard
      className={"h-auto min-h-0 w-full"}
      title="Summary"
      status={
        isFeatureEnabled("inventoryService") &&
        Array.isArray(reservations) && (
          <StatusIndicator
            onClick={
              allItemsReserved || !isAllocatable
                ? undefined
                : showReservationModal
            }
            variant={allItemsReserved || !isAllocatable ? "success" : "danger"}
            title={
              allItemsReserved || !isAllocatable
                ? t("detail-cards-allocated", "Allocated")
                : t("detail-cards-not-fully-allocated", "Not fully allocated")
            }
            className="rounded-rounded border px-3 py-1.5"
          />
        )
      }
      actionables={actionables}
    >
      <div className="mt-6">
        {order.items?.map((item, i) => (
          <OrderLine
            key={i}
            item={item}
            currencyCode={order.currency_code}
            reservations={reservationItemsMap[item.id]}
            isAllocatable={isAllocatable}
          />
        ))}
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.subtotal}
          totalTitle={t("detail-cards-subtotal", "Subtotal")}
        />
        {order?.discounts?.map((discount, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * order.discount_total}
            totalTitle={
              <div className="inter-small-regular flex items-center text-grey-90">
                {t("detail-cards-discount", "Discount:")}{" "}
                <Badge className="ml-3" variant="default">
                  {discount.code}
                </Badge>
              </div>
            }
          />
        ))}
        {order?.gift_card_transactions?.map((gcTransaction, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * gcTransaction.amount}
            totalTitle={
              <div className="inter-small-regular flex items-center text-grey-90">
                Gift card:
                <Badge className="ml-3" variant="default">
                  {gcTransaction.gift_card.code}
                </Badge>
                <div className="ml-2">
                  <CopyToClipboard
                    value={gcTransaction.gift_card.code}
                    showValue={false}
                    iconSize={16}
                  />
                </div>
              </div>
            }
          />
        ))}
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.shipping_total}
          totalTitle={t("detail-cards-shipping", "Shipping")}
        />
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.tax_total}
          totalTitle={t("detail-cards-tax", "Tax")}
        />
        <DisplayTotal
          variant={"large"}
          currency={order.currency_code}
          totalAmount={order.total}
          totalTitle={
            hasMovements
              ? t("detail-cards-original-total", "Original Total")
              : t("detail-cards-total", "Total")
          }
        />
        <PaymentDetails
          manualRefund={manualRefund}
          swapAmount={swapAmount}
          swapRefund={swapRefund}
          returnRefund={returnRefund}
          paidTotal={order.paid_total}
          refundedTotal={order.refunded_total}
          currency={order.currency_code}
        />
      </div>
      {reservationModalIsOpen && (
        <ReserveItemsModal
          reservationItemsMap={reservationItemsMap}
          items={order.items}
          close={closeReservationModal}
        />
      )}
    </BodyCard>
  )
}

export default SummaryCard
