import clsx from "clsx"
import {
  GroupBase,
  MultiValueGenericProps,
  MultiValueProps,
  MultiValueRemoveProps,
} from "react-select"
import CrossIcon from "../../../../fundamentals/icons/cross-icon"
import { optionIsFixed } from "../utils"

const MultiValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  children,
  className,
  cx,
  innerProps,
  isDisabled,
  isFocused,
  removeProps,
  components,
  selectProps,
  data,
}: MultiValueProps<Option, IsMulti, Group>) => {
  const { Container, Label, Remove } = components

  return (
    <Container
      data={data}
      innerProps={{
        className: cx(
          {
            "multi-value": true,
            "multi-value--is-disabled": isDisabled,
          },
          clsx({
            "bg-grey-70 text-grey-0": isFocused,
          })
        ),
        ...innerProps,
      }}
      selectProps={selectProps}
    >
      <Label
        data={data}
        innerProps={{
          className: cx(
            {
              "multi-value__label": true,
            },
            className
          ),
        }}
        selectProps={selectProps}
      >
        {children}
      </Label>
      <Remove
        data={data}
        selectProps={selectProps}
        innerProps={{
          className: cx(
            {
              "multi-value__remove": true,
            },
            className
          ),
          "aria-label": `Remove ${children || "option"}`,
          ...removeProps,
        }}
      />
    </Container>
  )
}

export default MultiValue

export const MultiValueContainer = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  children,
  innerProps: { className },
}: MultiValueGenericProps<Option, IsMulti, Group>) => {
  return (
    <span
      className={clsx(
        "inter-small-semibold flex items-center gap-x-2xsmall rounded-rounded bg-grey-20 py-2xsmall pl-small pr-2.5 text-grey-50 transition-colors",
        className
      )}
    >
      {children}
    </span>
  )
}

export const MultiValueRemove = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: MultiValueRemoveProps<Option, IsMulti, Group>
) => {
  const { children, innerProps, data } = props

  if (optionIsFixed(data) && data.isFixed) {
    return null
  }

  return (
    <div {...innerProps} role="button" className="text-grey-40">
      {children || <CrossIcon size={16} />}
    </div>
  )
}
