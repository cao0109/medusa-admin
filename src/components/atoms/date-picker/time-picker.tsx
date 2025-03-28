import * as PopoverPrimitive from "@radix-ui/react-popover"
import clsx from "clsx"
import { isNil } from "lodash"
import moment from "moment"
import React, { useEffect, useState } from "react"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ClockIcon from "../../fundamentals/icons/clock-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import NumberScroller from "../number-scroller"
import { DateTimePickerProps } from "./types"

const TimePicker: React.FC<DateTimePickerProps> = ({
  date,
  onSubmitDate,
  label = "start date",
  required = false,
  tooltipContent,
  tooltip,
}) => {
  const [selectedMinute, setSelectedMinute] = useState(
    new Date(date)?.getUTCMinutes()
  )
  const [selectedHour, setSelectedHour] = useState(
    new Date(date)?.getUTCHours()
  )

  useEffect(() => {
    setSelectedMinute(new Date(date)?.getUTCMinutes())
    setSelectedHour(new Date(date)?.getUTCHours())
  }, [date])

  useEffect(() => {
    if (date && !isNil(selectedHour) && !isNil(selectedMinute)) {
      const newDate = new Date(new Date(date).getTime())
      newDate.setUTCHours(selectedHour)
      newDate.setUTCMinutes(selectedMinute)
      onSubmitDate(newDate)
    }
  }, [selectedMinute, selectedHour])

  const [isOpen, setIsOpen] = useState(false)

  const minuteNumbers = [...Array(60).keys()]
  const hourNumbers = [...Array(24).keys()]

  return (
    <div className="w-full">
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            className={clsx("w-full rounded-rounded border ", {
              "border-violet-60 shadow-input": isOpen,
              "border-grey-20": !isOpen,
            })}
            type="button"
          >
            <InputContainer className="shadown-none border-0 focus-within:shadow-none">
              <div className="flex w-full justify-between pr-0.5 text-grey-50">
                <InputHeader
                  {...{
                    label,
                    required,
                    tooltipContent,
                    tooltip,
                  }}
                />
                <ArrowDownIcon size={16} />
              </div>
              <div className="flex w-full items-center text-left text-grey-40">
                <ClockIcon size={16} />
                <span className="mx-1">UTC</span>
                <span className="text-grey-90">
                  {date ? moment.utc(date).format("HH:mm") : "--:--"}
                </span>
              </div>
            </InputContainer>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={8}
          className="scrollbar-hide flex w-full rounded-rounded border border-grey-20 bg-grey-0 px-6 pt-6 pb-4 shadow-dropdown"
        >
          <NumberScroller
            numbers={hourNumbers}
            selected={selectedHour}
            onSelect={(n) => setSelectedHour(n as number)}
            className="pr-4"
          />
          <NumberScroller
            numbers={minuteNumbers}
            selected={selectedMinute}
            onSelect={(n) => setSelectedMinute(n as number)}
          />
          <div className="absolute bottom-4 left-0 right-0 z-10 h-xlarge bg-gradient-to-b from-transparent to-grey-0" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  )
}

export default TimePicker
