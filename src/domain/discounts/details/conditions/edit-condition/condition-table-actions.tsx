import clsx from "clsx"
import { useContext } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import { useAddConditionsModalScreen } from "./add-conditions-screens"
import { useEditConditionContext } from "./edit-condition-provider"

type Props = {
  numberOfSelectedRows: number
  onDeselect: () => void
  onRemove: () => void
}

const ExistingConditionTableActions = ({
  numberOfSelectedRows,
  onDeselect,
  onRemove,
}: Props) => {
  const { t } = useTranslation()
  const { condition } = useEditConditionContext()

  const addConditionsModalScreen = useAddConditionsModalScreen(condition)

  const showAddConditions = !!numberOfSelectedRows

  const classes = {
    "translate-y-[-42px]": !showAddConditions,
    "translate-y-[0px]": showAddConditions,
  }

  const { push } = useContext(LayeredModalContext)

  return (
    <div className="flex h-[34px] space-x-xsmall overflow-hidden">
      <div className={clsx("transition-all duration-200", classes)}>
        <div className="mb-2 flex h-[34px] items-center divide-x">
          <span className="inter-small-regular mr-3 text-grey-50">
            {t("edit-condition-selected-with-count", "{{count}}", {
              count: numberOfSelectedRows,
            })}
          </span>
          <div className="flex space-x-xsmall pl-3">
            <Button
              onClick={onDeselect}
              size="small"
              variant="ghost"
              className="border border-grey-20"
            >
              {t("edit-condition-deselect", "Deselect")}
            </Button>
            <Button
              onClick={onRemove}
              size="small"
              variant="ghost"
              className="border border-grey-20 text-rose-50"
            >
              {t("edit-condition-remove", "Remove")}
            </Button>
          </div>
        </div>
        <div className="flex h-[34px] justify-end">
          <Button
            size="small"
            variant="ghost"
            className="border border-grey-20"
            onClick={() => push(addConditionsModalScreen)}
          >
            <PlusIcon size={20} /> {t("edit-condition-add", "Add")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExistingConditionTableActions
