import { GiftCard } from "@medusajs/medusa"
import { useAdminUpdateGiftCard } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import GiftCardEndsAtForm, {
  GiftCardEndsAtFormType,
} from "../../../components/forms/gift-card/gift-card-ends-at-form"
import GiftCardRegionForm, {
  GiftCardRegionFormType,
} from "../../../components/forms/gift-card/gift-card-region-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type EditGiftCardModalProps = {
  onClose: () => void
  open: boolean
  giftCard: GiftCard
}

type EditGiftCardFormType = {
  region: GiftCardRegionFormType
  ends_at: GiftCardEndsAtFormType
}

const EditGiftCardModal = ({
  open,
  onClose,
  giftCard,
}: EditGiftCardModalProps) => {
  const { t } = useTranslation()
  const form = useForm<EditGiftCardFormType>({
    defaultValues: getDefaultValues(giftCard),
  })
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  const { mutate, isLoading } = useAdminUpdateGiftCard(giftCard.id)

  const notification = useNotification()

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        region_id: data.region.region_id.value,
        ends_at: data.ends_at.ends_at,
      },
      {
        onSuccess: () => {
          notification(
            t("details-updated-gift-card", "Updated Gift card"),
            t(
              "details-gift-card-was-successfully-updated",
              "Gift card was successfully updated"
            ),
            "success"
          )

          onClose()
        },
        onError: (err) => {
          notification(
            t(
              "details-failed-to-update-gift-card",
              "Failed to update Gift card"
            ),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  })

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(giftCard))
    }
  }, [open, reset, giftCard])

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">
            {t("details-edit-gift-card", "Edit Gift Card")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="flex flex-col gap-y-xlarge">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-details", "Details")}
                </h2>
                <GiftCardRegionForm form={nestedForm(form, "region")} />
              </div>
              <GiftCardEndsAtForm form={nestedForm(form, "ends_at")} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                onClick={onClose}
                type="button"
              >
                {t("details-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={isLoading || !isDirty}
                loading={isLoading}
              >
                {t("details-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (giftCard: GiftCard): EditGiftCardFormType => {
  return {
    region: {
      region_id: {
        label: giftCard.region.name,
        value: giftCard.region.id,
        currency_code: giftCard.region.currency_code,
      },
    },
    ends_at: {
      ends_at: giftCard.ends_at,
    },
  }
}

export default EditGiftCardModal
