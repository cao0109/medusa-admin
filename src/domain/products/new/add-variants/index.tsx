import clsx from "clsx"
import { useCallback, useContext, useEffect, useMemo } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { useTranslation } from "react-i18next"
import { CustomsFormType } from "../../../../components/forms/product/customs-form"
import { DimensionsFormType } from "../../../../components/forms/product/dimensions-form"
import CreateFlowVariantForm, {
  CreateFlowVariantFormType,
} from "../../../../components/forms/product/variant-form/create-flow-variant-form"
import { VariantOptionType } from "../../../../components/forms/product/variant-form/variant-select-options-form"
import useCheckOptions from "../../../../components/forms/product/variant-form/variant-select-options-form/hooks"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import TagInput from "../../../../components/molecules/tag-input"
import { useDebounce } from "../../../../hooks/use-debounce"
import useToggleState from "../../../../hooks/use-toggle-state"
import { NestedForm } from "../../../../utils/nested-form"
import NewVariant from "./new-variant"

type ProductOptionType = {
  id: string
  title: string
  values: string[]
}

export type AddVariantsFormType = {
  options: ProductOptionType[]
  entries: CreateFlowVariantFormType[]
}

type Props = {
  form: NestedForm<AddVariantsFormType>
  productCustoms: CustomsFormType
  productDimensions: DimensionsFormType
}

const AddVariantsForm = ({
  form,
  productCustoms,
  productDimensions,
}: Props) => {
  const { t } = useTranslation()
  const layeredModalContext = useContext(LayeredModalContext)
  const { control, path, register } = form

  const { checkForDuplicate, getOptions } = useCheckOptions(form)

  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
    update: updateOption,
  } = useFieldArray({
    control,
    name: path("options"),
    keyName: "fieldId",
    shouldUnregister: true,
  })

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
    update: updateVariant,
    move: moveVariant,
  } = useFieldArray({
    control,
    name: path("entries"),
    shouldUnregister: true,
  })

  const watchedOptions = useWatch({
    control,
    name: path("options"),
  })

  const watchedEntries = useWatch({
    control,
    name: path("entries"),
  })

  const debouncedOptions = useDebounce(watchedOptions, 500)

  useEffect(() => {
    if (debouncedOptions?.length) {
      const optionMap = debouncedOptions.reduce((acc, option) => {
        acc[option.id] = option
        return acc
      }, {} as Record<string, ProductOptionType>)

      const indexedVars = watchedEntries?.map((variant, index) => ({
        variant,
        index,
      }))

      if (indexedVars) {
        indexedVars.forEach((indexedVar) => {
          const { variant, index } = indexedVar

          const options = variant.options
          const validOptions: VariantOptionType[] = []

          options.forEach((option) => {
            const { option_id } = option
            const optionData = optionMap[option_id]

            if (optionData) {
              option.title = optionData.title

              if (
                !option.option?.value ||
                !optionData.values.includes(option.option.value)
              ) {
                option.option = null
              }

              validOptions.push(option)
            }
          })

          const validIds = validOptions.map((option) => option.option_id)
          const missingIds = Object.keys(optionMap).filter(
            (id) => !validIds.includes(id)
          )

          missingIds.forEach((id) => {
            const optionData = optionMap[id]
            validOptions.push({
              option_id: id,
              title: optionData.title,
              option: null,
            })
          })

          updateVariant(index, {
            ...variant,
            options: validOptions.map((va) => {
              return {
                id: uuidv4(),
                option_id: va.option_id,
                title: va.title,
                value: va,
                option: va.option,
              }
            }),
          })
        })
      }
    }
  }, [debouncedOptions])

  const onDeleteProductOption = (index: number) => {
    const option = watchedOptions[index]

    removeOption(index)

    if (!option) {
      return
    }

    watchedEntries?.forEach((variant, index) => {
      const options = variant.options

      const validOptions = options.filter((vo) => vo.option_id !== option.id)

      updateVariant(index, {
        ...variant,
        options: validOptions,
      })
    })
  }

  const onUpdateVariant = (index: number, data: CreateFlowVariantFormType) => {
    const toCheck = {
      id: data._internal_id!,
      options: data.options.map((vo) => vo.option!),
    } // We can be sure that the value is set as this point.
    const exists = checkForDuplicate(toCheck)

    if (exists) {
      return false
    }

    updateVariant(index, data)
    return true
  }

  const enableVariants = useMemo(() => {
    return watchedOptions?.length > 0
      ? watchedOptions.some((wo) => wo.values.length > 0)
      : false
  }, [watchedOptions])

  const appendNewOption = () => {
    appendOption({
      id: uuidv4(),
      title: "",
      values: [],
    })
  }

  const newVariantForm = useForm<CreateFlowVariantFormType>()
  const { reset, handleSubmit: submitVariant } = newVariantForm
  const { state, toggle } = useToggleState()

  const onToggleForm = () => {
    reset(createEmptyVariant(watchedOptions))
    toggle()
  }

  const onAppendVariant = submitVariant((data) => {
    const toCheck = {
      id: data._internal_id!,
      options: data.options.map((da) => da.option).filter((o) => !!o),
    }
    const exists = checkForDuplicate(toCheck)

    if (exists) {
      newVariantForm.setError("options", {
        type: "deps",
        message: t(
          "add-variants-a-variant-with-these-options-already-exists",
          "A variant with these options already exists."
        ),
      })
      return
    }

    appendVariant({
      ...data,
      options: data.options,
      general: {
        ...data.general,
        title: data.general.title
          ? data.general.title
          : data.options.map((vo) => vo.option?.value).join(" / "),
      },
    })
    onToggleForm()
  })

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    moveVariant(dragIndex, hoverIndex)
  }, [])

  const onAddNewProductOptionValue = (optionId: string, value: string) => {
    const option = watchedOptions?.find((wo) => wo.id === optionId)

    if (!option) {
      return
    }

    const index = watchedOptions?.findIndex((wo) => wo.id === optionId)

    updateOption(index, { ...option, values: [...option.values, value] })
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-x-2xsmall">
          <h3 className="inter-base-semibold">
            {t("add-variants-product-options", "Product options")}
          </h3>
          <IconTooltip
            type="info"
            content={t(
              "add-variants-options-are-used-to-define-the-color-size-etc-of-the-product",
              "Options are used to define the color, size, etc. of the product."
            )}
          />
        </div>
        <div>
          {options.length > 0 && (
            <div className="mt-small">
              <div className="inter-small-semibold mb-small grid grid-cols-[230px_1fr_40px] gap-x-xsmall text-grey-50">
                <span>{t("add-variants-option-title", "Option title")}</span>
                <span>
                  {t(
                    "add-variants-variations-comma-separated",
                    "Variations (comma separated)"
                  )}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-y-xsmall">
                {options.map((field, index) => {
                  return (
                    <div
                      key={field.fieldId}
                      className="grid grid-cols-[230px_1fr_40px] gap-x-xsmall"
                    >
                      <InputField
                        placeholder={t("add-variants-color", "Color...")}
                        {...register(path(`options.${index}.title`))}
                      />
                      <Controller
                        control={control}
                        name={path(`options.${index}.values`)}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <TagInput
                              onValidate={(newVal) => {
                                if (value.includes(newVal)) {
                                  return null
                                }

                                return newVal
                              }}
                              invalidMessage={t(
                                "add-variants-already-exists",
                                "already exists"
                              )}
                              showLabel={false}
                              values={value}
                              onChange={onChange}
                              placeholder={t(
                                "add-variants-blue-red-black",
                                "Blue, Red, Black..."
                              )}
                            />
                          )
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        type="button"
                        className="h-10"
                        onClick={() => onDeleteProductOption(index)}
                      >
                        <TrashIcon size={20} className="text-grey-40" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <Button
            variant="secondary"
            size="small"
            className="mt-base h-10 w-full"
            type="button"
            onClick={appendNewOption}
          >
            <PlusIcon size={20} />
            <span>{t("add-variants-add-an-option", "Add an option")}</span>
          </Button>
          <div className="mt-xlarge">
            <div className="flex items-center gap-x-2xsmall">
              <h3
                className={clsx("inter-base-semibold", {
                  "opacity-50": !options.length,
                })}
              >
                {t("add-variants-product-variants", "Product variants")}{" "}
                <span className="inter-base-regular text-grey-50">
                  ({variants?.length || 0})
                </span>
              </h3>
              {!enableVariants && (
                <IconTooltip
                  type="info"
                  content={t(
                    "add-variants-you-must-add-at-least-one-product-option-before-you-can-begin-adding-product-variants",
                    "You must add at least one product option before you can begin adding product variants."
                  )}
                />
              )}
            </div>
            {variants?.length > 0 && (
              <div className="mt-small">
                <div className="inter-small-semibold grid grid-cols-[1fr_90px_100px_48px] pr-base text-grey-50">
                  <p>{t("add-variants-variant", "Variant")}</p>
                  <div className="mr-xlarge flex justify-end">
                    <p>{t("add-variants-inventory", "Inventory")}</p>
                  </div>
                </div>
                <div>
                  {variants?.map((variant, index) => {
                    return (
                      <NewVariant
                        key={variant.id}
                        id={variant.id}
                        source={variant}
                        index={index}
                        save={onUpdateVariant}
                        remove={removeVariant}
                        move={moveCard}
                        options={getOptions()}
                        onCreateOption={onAddNewProductOptionValue}
                        productDimensions={productDimensions}
                        productCustoms={productCustoms}
                      />
                    )
                  })}
                </div>
              </div>
            )}
            <Button
              variant="secondary"
              size="small"
              className="mt-base h-10 w-full"
              type="button"
              disabled={!enableVariants}
              onClick={onToggleForm}
            >
              <PlusIcon size={20} />
              <span>{t("add-variants-add-a-variant", "Add a variant")}</span>
            </Button>
          </div>
        </div>
      </div>

      <LayeredModal
        context={layeredModalContext}
        open={state}
        handleClose={onToggleForm}
      >
        <Modal.Body>
          <Modal.Header handleClose={onToggleForm}>
            <h1 className="inter-xlarge-semibold">
              {t("add-variants-create-variant", "Create Variant")}
            </h1>
          </Modal.Header>
          <Modal.Content>
            <CreateFlowVariantForm
              form={newVariantForm}
              options={getOptions()}
              onCreateOption={onAddNewProductOptionValue}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onToggleForm}
              >
                {t("add-variants-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onAppendVariant}
              >
                {t("add-variants-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </LayeredModal>
    </>
  )
}

const createEmptyVariant = (
  options: ProductOptionType[]
): CreateFlowVariantFormType => {
  return {
    _internal_id: uuidv4(),
    general: {
      title: null,
      material: null,
    },
    prices: {
      prices: [],
    },
    stock: {
      manage_inventory: true,
      allow_backorder: false,
      sku: null,
      barcode: null,
      ean: null,
      upc: null,
      inventory_quantity: null,
    },
    dimensions: {
      weight: null,
      length: null,
      width: null,
      height: null,
    },
    customs: {
      hs_code: null,
      mid_code: null,
      origin_country: null,
    },
    options:
      options?.map((option) => ({
        title: option.title,
        option_id: option.id,
        option: null,
      })) || [],
  }
}

export default AddVariantsForm
