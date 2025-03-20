import React from "react"
import clsx from "clsx"

import CrossIcon from "../../fundamentals/icons/cross-icon"

type FilterTabProps = {
  label?: string
  isActive?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  removable?: boolean
  onRemove?: () => void
}

export const FilterTab: React.FC<FilterTabProps> = ({
  label,
  isActive,
  onClick,
  removable,
  onRemove,
}) => {
  const handleClick = (e) => {
    if (typeof onClick !== "undefined") {
      onClick(e)
    }
  }

  const handleRemove = () => {
    if (typeof onRemove !== "undefined") {
      onRemove()
    }
  }

  const handleKeyPress = (e) => {
    if (removable && onRemove) {
      if (e.key === "Backspace") {
        onRemove()
      }
    }
  }

  return (
    <button
      onKeyUp={handleKeyPress}
      onClick={handleClick}
      className={clsx(
        "inter-small-regular flex flex h-6 items-center items-center space-x-1 rounded-rounded border border-grey-20 bg-grey-5 px-2 text-grey-50 focus-visible:border-violet-60 focus-visible:shadow-input focus-visible:outline-none",
        {
          ["border-violet-60 bg-violet-5 text-violet-60 "]: isActive,
        }
      )}
    >
      {label}
      {removable && (
        <div onClick={handleRemove} className={"ml-1 cursor-pointer"}>
          <CrossIcon size={16} />
        </div>
      )}
    </button>
  )
}

export default FilterTab
