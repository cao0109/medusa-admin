import "react-datepicker/dist/react-datepicker.css"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import React, { useEffect, useState } from "react"

import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import Button from "../../fundamentals/button"
import CustomHeader from "./custom-header"
import { DateTimePickerProps } from "./types"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import ReactDatePicker from "react-datepicker"
import clsx from "clsx"
import moment from "moment"

const getDateClassname = (
  d: Date,
  tempDate: Date | null,
  greyPastDates: boolean = true
): string => {
  const classes: string[] = ["date"]
  if (
    tempDate &&
    moment(d).format("YY,MM,DD") === moment(tempDate).format("YY,MM,DD")
  ) {
    classes.push("chosen")
  } else if (
    greyPastDates &&
    moment(d).format("YY,MM,DD") < moment(new Date()).format("YY,MM,DD")
  ) {
    classes.push("past")
  }
  return classes.join(" ")
}

const DatePicker: React.FC<DateTimePickerProps> = ({
  date,
  onSubmitDate,
  label = "start date",
  required = false,
  tooltipContent,
  tooltip,
}) => {
  const [tempDate, setTempDate] = useState<Date | null>(date || null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => setTempDate(date), [isOpen])

  const submitDate = () => {
    if (!tempDate || !date) {
      onSubmitDate(null)
      setIsOpen(false)
      return
    }

    // update only date, month and year
    const newDate = new Date(date.getTime())
    newDate.setUTCDate(tempDate.getUTCDate())
    newDate.setUTCMonth(tempDate.getUTCMonth())
    newDate.setUTCFullYear(tempDate.getUTCFullYear())

    onSubmitDate(newDate)
    setIsOpen(false)
  }

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
                {label && (
                  <InputHeader
                    {...{
                      label,
                      required,
                      tooltipContent,
                      tooltip,
                    }}
                  />
                )}
                <ArrowDownIcon size={16} />
              </div>
              <label className="w-full text-left">
                {date
                  ? moment(date).format("ddd, DD MMM YYYY")
                  : "---, -- -- ----"}
              </label>
            </InputContainer>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          side="top"
          sideOffset={8}
          className="w-full rounded-rounded  border border-grey-20 bg-grey-0 px-8 shadow-dropdown"
        >
          <CalendarComponent
            date={tempDate}
            onChange={(date) => setTempDate(date)}
          />
          <div className="mb-8 mt-5 flex w-full">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setIsOpen(false)}
              className="mr-2 flex w-1/3 justify-center border border-grey-20"
            >
              Cancel
            </Button>
            <Button
              size="medium"
              variant="primary"
              onClick={() => submitDate()}
              className="flex w-2/3 justify-center"
            >{`Set ${label}`}</Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  )
}

type CalendarComponentProps = {
  date: Date | null
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event> | undefined
  ) => void
  greyPastDates?: boolean
}

export const CalendarComponent = ({
  date,
  onChange,
  greyPastDates = true,
}: CalendarComponentProps) => (
  <ReactDatePicker
    selected={date}
    inline
    onChange={onChange}
    calendarClassName="date-picker"
    dayClassName={(d) => getDateClassname(d, date, greyPastDates)}
    renderCustomHeader={({ ...props }) => <CustomHeader {...props} />}
  />
)

export default DatePicker
