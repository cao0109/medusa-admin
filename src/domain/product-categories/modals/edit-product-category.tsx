import { useEffect } from "react"

import { TFunction } from "i18next"
import { useAdminUpdateProductCategory } from "medusa-react"
import { useTranslation } from "react-i18next"

import { ProductCategory } from "@medusajs/medusa/dist/models"
import { Controller, useForm } from "react-hook-form"
import MetadataForm, {
  getSubmittableMetadata,
} from "../../../components/forms/general/metadata-form"
import ThumbnailForm from "../../../components/forms/product/thumbnail-form"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import SideModal from "../../../components/molecules/modal/side-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import TextArea from "../../../components/molecules/textarea"
import useNotification from "../../../hooks/use-notification"
import { FormImage, Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import { prepareImages } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import TreeCrumbs from "../components/tree-crumbs"
import { getDefaultCategoryValues } from "../utils"
import {
  CategoryFormData,
  CategoryStatus,
  CategoryVisibility,
} from "./add-product-category"

const visibilityOptions: (t: TFunction) => Option[] = (t) => [
  {
    label: "Public",
    value: CategoryVisibility.Public,
  },
  { label: "Private", value: CategoryVisibility.Private },
]

const statusOptions: (t: TFunction) => Option[] = (t) => [
  { label: "Active", value: CategoryStatus.Active },
  { label: "Inactive", value: CategoryStatus.Inactive },
]

type EditProductCategoriesSideModalProps = {
  activeCategory: ProductCategory
  close: () => void
  isVisible: boolean
  categories: ProductCategory[]
}
/**
 * Modal for editing product categories
 */
function EditProductCategoriesSideModal(
  props: EditProductCategoriesSideModalProps
) {
  const { isVisible, close, activeCategory, categories } = props

  const { t } = useTranslation()
  const notification = useNotification()

  const { mutateAsync: updateCategory } = useAdminUpdateProductCategory(
    activeCategory?.id
  )

  const form = useForm<CategoryFormData>({
    defaultValues: getDefaultCategoryValues(t, activeCategory),
    mode: "onChange",
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid, isSubmitting },
  } = form

  useEffect(() => {
    if (activeCategory) {
      reset(getDefaultCategoryValues(t, activeCategory))
    }
  }, [activeCategory, reset, t])

  const onSave = async (data: CategoryFormData) => {
    try {
      let categoryCover
      if (data.image?.images?.length) {
        let preppedImages: FormImage[] = []

        try {
          preppedImages = await prepareImages(data.image.images)
        } catch (error) {
          let errorMessage = t(
            "new-upload-thumbnail-error",
            "Something went wrong while trying to upload the thumbnail."
          )
          const response = (error as any).response as Response

          if (response.status === 500) {
            errorMessage =
              errorMessage +
              " " +
              t(
                "new-no-file-service-configured",
                "You might not have a file service configured. Please contact your administrator"
              )
          }

          notification(t("new-error", "Error"), errorMessage, "error")
          return
        }
        const urls = preppedImages.map((image) => image.url)

        categoryCover = urls[0]
      }

      await updateCategory({
        name: data.name,
        handle: data.handle,
        description: data.description,
        is_active: data.is_active.value === CategoryStatus.Active,
        is_internal: data.is_public.value === CategoryVisibility.Private,
        metadata: getSubmittableMetadata(data.metadata),
        image: categoryCover,
      })

      notification(
        t("modals-success", "Success"),
        t(
          "modals-successfully-updated-the-category",
          "Successfully updated the category"
        ),
        "success"
      )
      close()
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) ||
        t(
          "modals-failed-to-update-the-category",
          "Failed to update the category"
        )
      notification(t("modals-error", "Error"), errorMessage, "error")
    }
  }

  const onClose = () => {
    close()
  }

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between overflow-auto">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <Button
            size="small"
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
          <div className="flex gap-x-small">
            <Button
              size="small"
              variant="primary"
              disabled={!isDirty || !isValid || isSubmitting}
              onClick={handleSubmit(onSave)}
              className="rounded-rounded"
            >
              {t("modals-save-category", "Save category")}
            </Button>
          </div>
        </div>
        <h3 className="inter-large-semibold flex items-center gap-2 px-6 text-xl text-gray-900">
          {t("modals-edit-product-category", "Edit product category")}
        </h3>
        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {activeCategory && (
          <div className="mt-[25px] px-6">
            <TreeCrumbs
              nodes={categories}
              currentNode={activeCategory}
              showPlaceholder={false}
              placeholderText={""}
            />
          </div>
        )}

        <div className="flex-grow px-6">
          <InputField
            required
            label={t("modals-name", "Name") as string}
            type="string"
            className="my-6"
            placeholder={
              t(
                "modals-give-this-category-a-name",
                "Give this category a name"
              ) as string
            }
            {...register("name", { required: true })}
          />

          <InputField
            label={t("modals-handle", "Handle") as string}
            className="my-6"
            type="string"
            placeholder={t("modals-custom-handle", "Custom handle") as string}
            {...register("handle")}
          />

          <TextArea
            label={t("modals-description", "Description")}
            className="my-6"
            placeholder={
              t(
                "modals-give-this-category-a-description",
                "Give this category a description"
              ) as string
            }
            {...register("description")}
          />

          <Controller
            name="is_active"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <NextSelect
                  {...field}
                  label={t("modals-status", "Status") as string}
                  placeholder="Choose status"
                  options={statusOptions(t)}
                  value={
                    statusOptions(t)[
                      field.value?.value === CategoryStatus.Active ? 0 : 1
                    ]
                  }
                />
              )
            }}
          />

          <Controller
            name="is_public"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <NextSelect
                  {...field}
                  className="my-6"
                  label={t("modals-visibility", "Visibility") as string}
                  placeholder="Choose visibility"
                  options={visibilityOptions(t)}
                  value={
                    visibilityOptions(t)[
                      field.value.value === CategoryVisibility.Public ? 0 : 1
                    ]
                  }
                />
              )
            }}
          />

          <div className="mb-8">
            <p className="inter-base-regular text-grey-50">
              {t(
                "image-table-select-thumbnail-image-for-category",
                "Select the image to be used as a thumbnail for this category"
              )}
            </p>
            <ThumbnailForm form={nestedForm(form, "image")} />
          </div>

          <div className="mt-small mb-xlarge">
            <h2 className="inter-base-semibold mb-base">
              {t("collection-modal-metadata", "Metadata")}
            </h2>
            <MetadataForm form={nestedForm(form, "metadata")} />
          </div>
        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
