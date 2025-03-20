import clsx from "clsx"
import React, { useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import InputError from "../../../../components/atoms/input-error"
import { currencies } from "../../../../utils/currencies"

type Props = {
  currencyCode: string
  amount?: number | null
  onChange: (amount?: number) => void
  errors?: { [x: string]: unknown }
  name?: string
}

const PriceFormInput = ({
  name,
  currencyCode,
  errors,
  amount,
  onChange,
}: Props) => {
  const { symbol_native, decimal_digits } =
    currencies[currencyCode.toUpperCase()]

  const getFormattedValue = (value: number) => {
    return `${value / 10 ** decimal_digits}`
  }

  const [formattedValue, setFormattedValue] = useState<string | undefined>(
    amount !== null && amount !== undefined
      ? getFormattedValue(amount)
      : undefined
  )

  useEffect(() => {
    if (amount) {
      setFormattedValue(getFormattedValue(amount))
    }
  }, [amount, decimal_digits])

  const onAmountChange = (value?: string, floatValue?: number | null) => {
    if (typeof floatValue === "number") {
      const numericalValue = Math.round(floatValue * 10 ** decimal_digits)
      onChange(numericalValue)
    } else {
      onChange(undefined)
    }
    setFormattedValue(value)
  }

  const step = 10 ** -decimal_digits

  return (
    <div>
      <div
        className={clsx(
          "border-gray-20 flex h-10 w-full items-center rounded-rounded border bg-grey-5 px-small py-xsmall focus-within:border-violet-60 focus-within:shadow-input",
          {
            "border-rose-50": errors && name && errors[name],
          }
        )}
      >
        <span className="inter-base-regular text-grey-40">{symbol_native}</span>

        <AmountField
          step={step}
          value={formattedValue}
          onValueChange={(value, _name, values) =>
            onAmountChange(value, values?.float)
          }
          allowNegativeValue={false}
          placeholder="-"
          decimalScale={decimal_digits}
          className="remove-number-spinner w-full bg-transparent text-right font-normal leading-base text-grey-90 placeholder-grey-40 caret-violet-60 outline-none outline-0"
        />
      </div>
      <InputError name={name} errors={errors} />
    </div>
  )
}

export default PriceFormInput
