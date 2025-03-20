import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import React, { useState } from "react"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"

export type FilteringOptionProps = {
  title: string
  options: {
    title: string
    count?: number
    onClick: () => void
  }[]
} & React.HTMLAttributes<HTMLDivElement>

const FilteringOptions: React.FC<FilteringOptionProps> = ({
  title,
  options,
  className,
  ...props
}) => {
  const [selected, setSelected] = useState(options?.[0]?.title || "All")
  const [open, setOpen] = useState(false)
  return (
    <div
      className={clsx(
        "inter-small-regular mr-6 flex text-grey-50 last:mr-0",
        className
      )}
      {...props}
    >
      <span className="">{title}:</span>
      <DropdownMenu.Root onOpenChange={setOpen}>
        <DropdownMenu.Trigger
          asChild
          className={clsx(
            "inter-small-regular flex items-center rounded pl-1.5 pr-0.5 text-grey-50 hover:bg-grey-5 active:bg-grey-5",
            { "bg-grey-5": open }
          )}
        >
          <div className="align-center flex">
            {selected}
            <div className="h-min text-grey-40">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={8}
          className="rounded-rounded border border-grey-20 bg-grey-0 p-2 shadow-dropdown"
        >
          {options.map((opt, idx) => (
            <DropdownMenu.DropdownMenuItem
              key={`${idx}-${opt.title}`}
              onSelect={() => {
                opt.onClick()
                setSelected(opt.title)
              }}
              disabled={typeof opt.count !== "undefined" && opt.count < 1}
              className={clsx(
                "inter-small-semibold my-1 flex w-48 items-center rounded py-1.5 px-3  text-grey-90 hover:border-0 hover:outline-none",
                {
                  "cursor-pointer hover:bg-grey-10":
                    typeof opt.count === "undefined" || opt.count > 0,
                }
              )}
            >
              {selected === opt.title && (
                <span className="w-4">
                  <CheckIcon size={16} />
                </span>
              )}
              <div
                className={clsx("ml-3 flex w-full justify-between", {
                  "ml-7": selected !== opt.title,
                  "text-grey-30": (opt.count || 0) < 1,
                })}
              >
                {opt.title}
                <span
                  className={clsx("inter-small-regular ml-3 text-grey-40", {
                    "text-grey-30": (opt.count || 0) < 1,
                  })}
                >
                  {opt.count}
                </span>
              </div>
            </DropdownMenu.DropdownMenuItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default FilteringOptions
