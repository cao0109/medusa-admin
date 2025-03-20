import clsx from "clsx"
import React, { MouseEventHandler } from "react"

type InputContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onFocusLost?: () => void
}

const InputContainer: React.FC<InputContainerProps> = ({
  onClick,
  onFocusLost,
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      tabIndex={-1}
      onClick={onClick}
      onBlur={(e) => {
        if (onFocusLost && !e.currentTarget.contains(e.relatedTarget)) {
          onFocusLost()
        }
      }}
      className={clsx([
        `inter-base-regular h-18 flex w-full cursor-text flex-col rounded-rounded border border-grey-20 bg-grey-5 p-3 focus-within:border-violet-60 focus-within:shadow-input`,
        className,
      ])}
    >
      {children}
    </div>
  )
}

export default InputContainer
