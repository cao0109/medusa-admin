import {
  ActionMeta,
  CX,
  GroupBase,
  MenuListProps,
  MenuProps,
  NoticeProps,
  OnChangeValue,
  OptionProps,
  OptionsOrGroups,
  PropsValue,
} from "react-select"
import { hasPrefix, hasSuffix, optionIsDisabled } from "../utils"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import Button from "../../../../fundamentals/button"
import CheckIcon from "../../../../fundamentals/icons/check-icon"
import ListArrowIcon from "../../../../fundamentals/icons/list-arrow-icon"
import SelectPrimitives from "./select-primitives"
import clsx from "clsx"

const Menu = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  className,
  cx,
  children,
  innerProps,
  innerRef,
  placement,
  selectProps: { onMenuClose, menuIsOpen, customStyles, styles },
}: MenuProps<Option, IsMulti, Group>) => {
  useEffect(() => {
    const closeOnResize = () => {
      if (menuIsOpen) {
        onMenuClose()
      }
    }

    window.addEventListener("resize", closeOnResize)

    return () => {
      window.removeEventListener("resize", closeOnResize)
    }
  }, [menuIsOpen, onMenuClose])

  return (
    <div
      {...innerProps}
      ref={innerRef}
      style={{ ...styles?.menu }}
      className={cx(
        { menu: true },
        clsx(
          "border-border absolute z-[60] mb-base w-full overflow-hidden rounded-rounded border border-grey-20 bg-grey-0 shadow-dropdown",
          {
            "top-[calc(100%+8px)]": placement === "bottom",
            "bottom-full": placement === "top",
          },
          className,
          customStyles?.menu
        )
      )}
    >
      {children}
    </div>
  )
}

export default Menu

type SelectAllOptionProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = {
  cx: CX
  onChange: (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => void
  options: OptionsOrGroups<Option, Group>
  value: PropsValue<Option>
}

const SelectAllOption = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  cx,
  onChange,
  options,
  value,
}: SelectAllOptionProps<Option, IsMulti, Group>) => {
  const [isFocused, setIsFocused] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  const isAllSelected = useMemo(() => {
    if (Array.isArray(value)) {
      const selectableOptions = options.filter((o) => !optionIsDisabled(o))
      return value.length === selectableOptions.length
    }

    return false
  }, [options, value])

  const onClick = useCallback(() => {
    if (isAllSelected) {
      onChange([] as unknown as OnChangeValue<Option, IsMulti>, {
        action: "deselect-option",
        option: [] as unknown as Option,
      })
    } else {
      const selectableOptions = options.filter((o) => !optionIsDisabled(o))

      onChange(selectableOptions as unknown as OnChangeValue<Option, IsMulti>, {
        action: "select-option",
        option: selectableOptions as unknown as Option,
      })
    }
  }, [isAllSelected, onChange, options])

  useEffect(() => {
    setIsFocused(
      document.activeElement !== null && document.activeElement === ref.current
    )

    return () => {
      setIsFocused(false)
    }
  }, [])

  return (
    <Button
      ref={ref}
      variant="secondary"
      size="small"
      className={cx(
        {
          option: true,
          "option--is-focused": isFocused,
        },
        clsx("mx-base mb-2xsmall h-xlarge")
      )}
      type="button"
      onClick={onClick}
    >
      <ListArrowIcon size={16} />
      <span className="inter-small-semibold">
        {!isAllSelected ? "Select All" : "Deselect All"}
      </span>
    </Button>
  )
}

export const MenuList = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: MenuListProps<Option, IsMulti, Group>
) => {
  const {
    className,
    children,
    cx,
    isMulti,
    selectProps: { selectAll, value, onChange },
    options,
  } = props
  return (
    <SelectPrimitives.MenuList
      {...props}
      className={cx(
        {
          "menu-list": true,
          "menu-list--is-multi": isMulti,
        },
        clsx("no-scrollbar flex flex-col overflow-y-auto py-xsmall", className)
      )}
    >
      {isMulti && selectAll && (
        <SelectAllOption
          cx={cx}
          onChange={onChange}
          options={options}
          value={value}
        />
      )}
      {children}
    </SelectPrimitives.MenuList>
  )
}

export const LoadingMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  cx,
  className,
  selectProps: { size },
}: NoticeProps<Option, IsMulti, Group>) => {
  const Skeleton = () => {
    return (
      <div
        className={clsx(
          "flex w-full items-center px-base transition-colors hover:bg-grey-5",
          {
            "h-xlarge": size === "sm",
            "h-10": size === "md" || !size,
          }
        )}
      >
        <div className="h-xsmall w-1/4 animate-pulse rounded-rounded bg-grey-10" />
      </div>
    )
  }

  return (
    <div
      {...innerProps}
      className={cx(
        {
          "menu-notice": true,
          "menu-notice--loading": true,
        },
        clsx("flex flex-col", className)
      )}
    >
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  )
}

export const Option = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: OptionProps<Option, IsMulti, Group>
) => {
  const {
    isSelected,
    isDisabled,
    isFocused,
    children,
    cx,
    className,
    innerProps,
    innerRef,
    selectProps: { hideSelectedOptions, isMulti, size, truncateOption },
  } = props

  const prefix = hasPrefix(props.data) ? props.data.prefix : null
  const suffix = hasSuffix(props.data) ? props.data.suffix : null

  return (
    <div
      role="button"
      className={cx(
        {
          option: true,
          "option--is-selected": isSelected,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
        },
        clsx(
          "flex items-center justify-between py-xsmall px-base transition-colors hover:bg-grey-5",
          {
            "cursor-not-allowed select-none text-grey-30": isDisabled,
            "bg-grey-10": isFocused && !isDisabled,
            hidden: hideSelectedOptions && isSelected,
          },
          {
            "h-xlarge": size === "sm",
            "min-h-10": size === "md" || !size,
          },
          className
        )
      )}
      ref={innerRef}
      data-diabled={isDisabled ? true : undefined}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={isDisabled ? -1 : 0}
      {...innerProps}
    >
      <div className="flex flex-1 items-center gap-x-small">
        {isMulti && (
          <CheckboxAdornment isSelected={isSelected} isDisabled={isDisabled} />
        )}
        <div
          className={clsx(
            "inter-base-regular flex flex-1 items-center justify-between gap-x-xsmall",
            {
              truncate: !!truncateOption,
            }
          )}
        >
          {prefix && <span className="inter-base-semibold">{prefix}</span>}
          <span className="w-full">{children}</span>

          {suffix && (
            <span className="inter-base-regular justify-self-end text-grey-50">
              {suffix}
            </span>
          )}
        </div>
      </div>
      {!isMulti && (
        <div className="ml-xsmall w-5">
          {isSelected && <CheckIcon size={16} />}
        </div>
      )}
    </div>
  )
}

const CheckboxAdornment = ({
  isSelected,
  isDisabled,
}: Pick<OptionProps, "isSelected" | "isDisabled">) => {
  return (
    <div
      className={clsx(
        `flex h-base w-base justify-center rounded-base border border-grey-30 text-grey-0 transition-colors`,
        {
          "border-violet-60 bg-violet-60": isSelected,
          "bg-grey-5": isDisabled,
        }
      )}
    >
      <span className="self-center">
        {isSelected && <CheckIcon size={10} />}
      </span>
    </div>
  )
}
