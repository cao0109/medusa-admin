import React from "react"
import Badge from "../../../components/fundamentals/badge"
import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"

type NumberedItemProps = {
  actions?: ActionType[]
  index: number
  title: string
  description?: React.ReactNode | string
}

const NumberedItem: React.FC<NumberedItemProps> = ({
  actions,
  index,
  title,
  description,
}) => {
  return (
    <div className="flex items-center justify-between gap-base rounded-rounded border p-base">
      <div className="flex w-full gap-base overflow-hidden">
        <div>
          <Badge
            className="inter-base-semibold flex h-[40px] w-[40px] items-center justify-center"
            variant="default"
          >
            §{index}
          </Badge>
        </div>
        <div className="flex w-full flex-1 flex-col justify-center truncate">
          <div className="inter-small-semibold">{title}</div>
          {description &&
            (typeof description === "string" ? (
              <div className="inter-small-regular text-grey-50">
                {description}
              </div>
            ) : (
              description
            ))}
        </div>
      </div>
      {actions && (
        <div>
          <Actionables forceDropdown actions={actions} />
        </div>
      )}
    </div>
  )
}

export default NumberedItem
