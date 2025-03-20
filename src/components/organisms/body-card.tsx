import clsx from "clsx"
import React from "react"
import { useScroll } from "../../hooks/use-scroll"
import Button from "../fundamentals/button"
import Actionables, { ActionType } from "../molecules/actionables"

type BodyCardProps = {
  title?: string | JSX.Element | React.ReactNode
  subtitle?: string
  events?: {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
  }[]
  actionables?: ActionType[]
  forceDropdown?: boolean
  customActionable?: React.ReactNode
  status?: React.ReactNode
  customHeader?: React.ReactNode
  compact?: boolean
  footerMinHeight?: number
  setBorders?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const BodyCard: React.FC<BodyCardProps> = ({
  title,
  subtitle,
  events,
  actionables,
  forceDropdown = false,
  customActionable,
  status,
  customHeader,
  className,
  children,
  compact = false,
  setBorders = false,
  footerMinHeight = 24,
  ...rest
}) => {
  const { isScrolled, scrollListener } = useScroll({ threshold: 16 })
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col overflow-hidden rounded-rounded border border-grey-20 bg-grey-0",
        { "min-h-[350px]": !compact },
        className
      )}
      {...rest}
    >
      <div className="relative">
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 z-10 h-xlarge rounded-t-rounded bg-gradient-to-b from-grey-0 to-[rgba(255,255,255,0)]" />
        )}
      </div>
      <div
        className={clsx("flex grow flex-col", {
          "border-b border-solid border-grey-20": setBorders,
        })}
        onScroll={scrollListener}
      >
        <div
          className={clsx("px-xlarge py-large", {
            "border-b border-solid border-grey-20": setBorders,
          })}
        >
          <div className="flex items-start justify-between">
            <div>
              {customHeader ? (
                <div>{customHeader}</div>
              ) : title ? (
                <h1 className="inter-xlarge-semibold text-grey-90">{title}</h1>
              ) : (
                <div />
              )}

              {subtitle && (
                <h3 className="inter-small-regular pt-1.5 text-grey-50">
                  {subtitle}
                </h3>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {status && status}
              <Actionables
                actions={actionables}
                forceDropdown={forceDropdown}
                customTrigger={customActionable}
              />
            </div>
          </div>
        </div>

        <div className="px-xlarge">
          {children && (
            <div
              className={clsx("flex flex-col", {
                grow: !compact,
              })}
            >
              {children}
            </div>
          )}
        </div>
      </div>
      {events && events.length > 0 ? (
        <div className="border-t border-grey-20 px-xlarge pb-large pt-base">
          <div className="flex flex-row-reverse items-center">
            {events.map((event, i: React.Key) => {
              return (
                <Button
                  key={i}
                  onClick={event.onClick}
                  className="justify-center first:ml-xsmall"
                  variant={i === 0 ? "primary" : "secondary"}
                  size={"small"}
                  type={event.type}
                >
                  {event.label}
                </Button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className={`min-h-[${footerMinHeight}px]`} />
      )}
    </div>
  )
}

export default BodyCard
