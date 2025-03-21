import { ClaimReason, Order, StockLocationDTO } from "@medusajs/medusa"
import { useAdminStockLocations, useAdminCreateClaim } from "medusa-react"
import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Spinner from "../../../../components/atoms/spinner"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import Select from "../../../../components/molecules/select/next-select/select"
import { AddressPayload } from "../../../../components/templates/address-form"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import ClaimTypeForm, {
  ClaimTypeFormType,
} from "../../components/claim-type-form"
import ItemsToReturnForm, {
  ItemsToReturnFormType,
} from "../../components/items-to-return-form"
import ItemsToSendForm, {
  ItemsToSendFormType,
} from "../../components/items-to-send-form"
import { RefundAmountFormType } from "../../components/refund-amount-form"
import { ClaimSummary } from "../../components/rma-summaries"
import SendNotificationForm, {
  SendNotificationFormType,
} from "../../components/send-notification-form"
import ShippingAddressForm from "../../components/shipping-address-form"
import ShippingForm, { ShippingFormType } from "../../components/shipping-form"
import { getDefaultClaimValues } from "../utils/get-default-values"

export type CreateClaimFormType = {
  notification: SendNotificationFormType
  return_items: ItemsToReturnFormType
  additional_items: ItemsToSendFormType
  return_shipping: ShippingFormType
  selected_location?: {
    value: string
    label: string
  }
  replacement_shipping: ShippingFormType
  shipping_address: AddressPayload
  claim_type: ClaimTypeFormType
  refund_amount: RefundAmountFormType
}

type Props = {
  order: Order
  onClose: () => void
}

const RegisterClaimMenu = ({ order, onClose }: Props) => {
  const context = useLayeredModal()
  const { mutate, isLoading } = useAdminCreateClaim(order.id)
  const { t } = useTranslation()

  const { isFeatureEnabled } = useFeatureFlag()
  const isLocationFulfillmentEnabled =
    isFeatureEnabled("inventoryService") &&
    isFeatureEnabled("stockLocationService")

  const {
    stock_locations,
    refetch: refetchLocations,
    isLoading: isLoadingLocations,
  } = useAdminStockLocations(
    {},
    {
      enabled: isLocationFulfillmentEnabled,
    }
  )

  useEffect(() => {
    if (isLocationFulfillmentEnabled) {
      refetchLocations()
    }
  }, [isLocationFulfillmentEnabled, refetchLocations])

  const form = useForm<CreateClaimFormType>({
    defaultValues: getDefaultClaimValues(order),
  })
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    setError,
    control,
  } = form

  const notification = useNotification()
  const dialog = useImperativeDialog()

  useEffect(() => {
    reset(getDefaultClaimValues(order))
  }, [order, reset])

  const handleClose = () => {
    context.reset()
    onClose()
  }

  const onCancel = async () => {
    let shouldClose = true

    if (isDirty) {
      shouldClose = await dialog({
        heading: t(
          "claim-are-you-sure-you-want-to-close",
          "Are you sure you want to close?"
        ),
        text: t(
          "claim-you-have-unsaved-changes-are-you-sure-you-want-to-close",
          "You have unsaved changes, are you sure you want to close?"
        ),
      })
    }

    if (shouldClose) {
      handleClose()
    }
  }

  const onSubmit = handleSubmit((data) => {
    const type = data.claim_type.type
    const returnShipping = data.return_shipping
    const refundAmount = data.refund_amount?.amount
    const returnLocation = data.selected_location?.value

    const replacementShipping =
      type === "replace" && data.replacement_shipping.option
        ? {
            option_id: data.replacement_shipping.option.value.id,
            /**
             * We set the price to 0 as we don't want to make the shippng price
             * affect the refund amount currently. This is a temporary solution,
             * and users should instead use the refund amount field to specify
             * the amount to refund when they receive the returned items if they
             * wish to deduct the cost of shipping.
             */
            price: 0,
          }
        : undefined

    const items = data.return_items.items
      .filter((item) => item.return)
      .map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        note: item.return_reason_details.note || undefined,
        reason: item.return_reason_details.reason?.value as ClaimReason,
      }))

    const returnItemsMissingReason = items.filter((item) => !item.reason)

    if (returnItemsMissingReason.length > 0) {
      returnItemsMissingReason.forEach((item) => {
        const index = items.findIndex((i) => i.item_id === item.item_id)

        setError(
          `return_items.items.${index}.return_reason_details`,
          {
            type: "manual",
            message: t(
              "claim-please-select-a-reason",
              "Please select a reason"
            ),
          },
          { shouldFocus: true }
        )
      })

      return
    }

    if (type === "replace" && !data.replacement_shipping.option) {
      setError(
        `replacement_shipping.option`,
        {
          type: "manual",
          message: t(
            "claim-a-shipping-method-for-replacement-items-is-required",
            "A shipping method for replacement items is required"
          ),
        },
        { shouldFocus: true }
      )
      return
    }

    mutate(
      {
        claim_items: items,
        type: type,
        return_shipping: returnShipping.option
          ? {
              option_id: returnShipping.option.value.id,
              price: 0,
            }
          : undefined,
        additional_items:
          type === "replace"
            ? data.additional_items.items.map((item) => ({
                quantity: item.quantity,
                variant_id: item.variant_id,
              }))
            : undefined,
        no_notification: !data.notification.send_notification,
        refund_amount:
          type === "refund" && refundAmount !== undefined
            ? refundAmount
            : undefined,
        shipping_address:
          type === "replace"
            ? {
                address_1: data.shipping_address.address_1,
                address_2: data.shipping_address.address_2 || undefined,
                city: data.shipping_address.city,
                country_code: data.shipping_address.country_code.value,
                company: data.shipping_address.company || undefined,
                first_name: data.shipping_address.first_name,
                last_name: data.shipping_address.last_name,
                phone: data.shipping_address.phone || undefined,
                postal_code: data.shipping_address.postal_code,
                province: data.shipping_address.province || undefined,
              }
            : undefined,
        return_location_id: returnLocation,
        shipping_methods: replacementShipping
          ? [replacementShipping]
          : undefined,
      },
      {
        onSuccess: () => {
          notification(
            t("claim-successfully-created-claim", "Successfully created claim"),
            t(
              "claim-created",
              "A claim for order #{{display_id}} was successfully created",
              {
                display_id: order.display_id,
              }
            ),
            "success"
          )
          handleClose()
        },
        onError: (err) => {
          notification(
            t("claim-error-creating-claim", "Error creating claim"),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  })

  const watchedType = useWatch({
    control: form.control,
    name: "claim_type.type",
  })

  const watchedItems = useWatch({
    control: form.control,
    name: "return_items.items",
  })

  return (
    <LayeredModal
      open={true}
      handleClose={onCancel}
      context={context}
      isLargeModal
    >
      <Modal.Body>
        <Modal.Header handleClose={onCancel}>
          <h1 className="inter-xlarge-semibold">
            {t("claim-create-claim", "Create Claim")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit} data-testid="register-claim-form">
          <Modal.Content>
            <div className="flex flex-col gap-y-xlarge">
              <ItemsToReturnForm
                form={nestedForm(form, "return_items")}
                order={order}
                isClaim={true}
              />
              <ShippingForm
                form={nestedForm(form, "return_shipping")}
                order={order}
                isReturn={true}
                isClaim={true}
              />

              {isLocationFulfillmentEnabled && (
                <div className="mb-8">
                  <h3 className="inter-base-semibold ">
                    {t("claim-location", "Location")}
                  </h3>
                  <p className="inter-base-regular text-grey-50">
                    {t(
                      "claim-choose-which-location-you-want-to-return-the-items-to",
                      "Choose which location you want to return the items to."
                    )}
                  </p>
                  {isLoadingLocations ? (
                    <Spinner />
                  ) : (
                    <Controller
                      control={control}
                      name={"selected_location"}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Select
                            className="mt-2"
                            placeholder={t(
                              "claim-select-location-to-return-to",
                              "Select Location to Return to"
                            )}
                            value={value}
                            isMulti={false}
                            onChange={onChange}
                            options={
                              stock_locations?.map((sl: StockLocationDTO) => ({
                                label: sl.name,
                                value: sl.id,
                              })) || []
                            }
                          />
                        )
                      }}
                    />
                  )}
                </div>
              )}

              <ClaimTypeForm form={nestedForm(form, "claim_type")} />
              {watchedType === "replace" && (
                <>
                  <ItemsToSendForm
                    form={nestedForm(form, "additional_items")}
                    order={order}
                  />
                  <ShippingAddressForm
                    form={nestedForm(form, "shipping_address")}
                    order={order}
                  />
                  <ShippingForm
                    form={nestedForm(form, "replacement_shipping")}
                    isClaim={true}
                    order={order}
                  />
                </>
              )}
              <ClaimSummary form={form} order={order} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-between">
              <SendNotificationForm
                form={nestedForm(form, "notification")}
                type="claim"
              />
              <div className="flex items-center justify-end gap-x-xsmall">
                <Button
                  variant="secondary"
                  size="small"
                  type="button"
                  onClick={onCancel}
                >
                  {t("claim-cancel", "Cancel")}
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  disabled={!isDirty || isLoading || watchedItems?.length < 1}
                >
                  {t("claim-submit-and-close", "Submit and close")}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </LayeredModal>
  )
}

export default RegisterClaimMenu
