import clsx from "clsx"
import React from "react"
import Actionables, { ActionType } from "../../molecules/actionables"

type SectionProps = {
  children?: React.ReactNode
  title?: string
  actions?: ActionType[]
  customActions?: React.ReactNode
  forceDropdown?: boolean
  status?: React.ReactNode
  className?: string
}

const Section = ({
  title,
  actions,
  customActions,
  forceDropdown = false,
  status,
  children,
  className,
}: SectionProps) => {
  const hasHeader = title || actions || customActions || status

  return (
    <div
      className={clsx(
        "rounded-rounded border border-grey-20 bg-grey-0 px-xlarge pt-large pb-xlarge",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-center justify-between">
          {title && (
            <h1 className="inter-xlarge-semibold text-grey-90">{title}</h1>
          )}
          <div className="flex items-center gap-x-2">
            {customActions && customActions}
            {status && status}
            {actions && (
              <Actionables actions={actions} forceDropdown={forceDropdown} />
            )}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

export default Section
