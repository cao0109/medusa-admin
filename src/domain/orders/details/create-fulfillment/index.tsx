import {
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  ClaimOrder,
  Order,
  Swap,
} from "@medusajs/medusa"
import {
  useAdminCreateFulfillment,
  useAdminFulfillClaim,
  useAdminFulfillSwap,
} from "medusa-react"
import React, { useState } from "react"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import Metadata, {
  MetadataField,
} from "../../../../components/organisms/metadata"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import CreateFulfillmentItemsTable from "./item-table"

type CreateFulfillmentModalProps = {
  handleCancel: () => void
  address?: object
  email?: string
  orderToFulfill: Order | ClaimOrder | Swap
  orderId: string
}

const CreateFulfillmentModal: React.FC<CreateFulfillmentModalProps> = ({
  handleCancel,
  orderToFulfill,
  orderId,
}) => {
  const [toFulfill, setToFulfill] = useState<string[]>([])
  const [quantities, setQuantities] = useState({})
  const [noNotis, setNoNotis] = useState(false)
  const [metadata, setMetadata] = useState<MetadataField[]>([
    { key: "", value: "" },
  ])

  const items =
    "items" in orderToFulfill
      ? orderToFulfill.items
      : orderToFulfill.additional_items

  const createOrderFulfillment = useAdminCreateFulfillment(orderId)
  const createSwapFulfillment = useAdminFulfillSwap(orderId)
  const createClaimFulfillment = useAdminFulfillClaim(orderId)

  const isSubmitting =
    createOrderFulfillment.isLoading ||
    createSwapFulfillment.isLoading ||
    createClaimFulfillment.isLoading

  const notification = useNotification()

  const createFulfillment = () => {
    const [type] = orderToFulfill.id.split("_")

    type actionType =
      | typeof createOrderFulfillment
      | typeof createSwapFulfillment
      | typeof createClaimFulfillment

    let action: actionType = createOrderFulfillment
    let successText = "Successfully fulfilled order"
    let requestObj

    const preparedMetadata = metadata.reduce((acc, next) => {
      if (next.key) {
        return {
          ...acc,
          [next.key]: next.value,
        }
      } else {
        return acc
      }
    }, {})

    switch (type) {
      case "swap":
        action = createSwapFulfillment
        successText = "Successfully fulfilled swap"
        requestObj = {
          swap_id: orderToFulfill.id,
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderSwapsSwapFulfillmentsReq
        break

      case "claim":
        action = createClaimFulfillment
        successText = "Successfully fulfilled claim"
        requestObj = {
          claim_id: orderToFulfill.id,
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderClaimsClaimFulfillmentsReq
        break

      default:
        requestObj = {
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderFulfillmentsReq
        requestObj.items = toFulfill
          .map((itemId) => ({ item_id: itemId, quantity: quantities[itemId] }))
          .filter((t) => !!t)
        break
    }

    action.mutate(requestObj, {
      onSuccess: () => {
        notification("Success", successText, "success")
        handleCancel()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  return (
    <Modal handleClose={handleCancel}>
      <Modal.Body>
        <Modal.Header handleClose={handleCancel}>
          <span className="inter-xlarge-semibold">Create Fulfillment</span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-base-semibold mb-2">Items</span>
            <CreateFulfillmentItemsTable
              items={items}
              toFulfill={toFulfill}
              setToFulfill={setToFulfill}
              quantities={quantities}
              setQuantities={setQuantities}
            />
            <div className="mt-4">
              <Metadata metadata={metadata} setMetadata={setMetadata} />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex h-8 w-full justify-between">
            <div
              className="flex h-full cursor-pointer items-center"
              onClick={() => setNoNotis(!noNotis)}
            >
              <div
                className={`flex h-5 w-5 justify-center rounded-base border border-grey-30 text-grey-0 ${
                  !noNotis && "bg-violet-60"
                }`}
              >
                <span className="self-center">
                  {!noNotis && <CheckIcon size={16} />}
                </span>
              </div>
              <input
                id="noNotification"
                className="hidden"
                name="noNotification"
                checked={!noNotis}
                type="checkbox"
              />
              <span className="ml-3 flex items-center gap-x-xsmall text-grey-90">
                Send notifications
                <IconTooltip content="" />
              </span>
            </div>
            <div className="flex">
              <Button
                variant="ghost"
                className="mr-2 w-32 justify-center text-small"
                size="large"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="w-32 justify-center text-small"
                variant="primary"
                disabled={!toFulfill?.length || isSubmitting}
                onClick={createFulfillment}
                loading={isSubmitting}
              >
                Complete
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CreateFulfillmentModal
