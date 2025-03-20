import React from "react"

type GridInputProps = React.InputHTMLAttributes<HTMLInputElement>

const GridInput: React.FC<GridInputProps> = ({ value, ...props }) => {
  return (
    <input
      className="inter-small-regular h-full w-full rounded-rounded border border-transparent bg-transparent py-4 px-2 leading-base outline-none outline-0 placeholder:text-grey-40 focus-within:border focus-within:border-violet-60 focus-within:shadow-input"
      value={value}
      {...props}
    />
  )
}

export default GridInput
