import * as RadixSwitch from "@radix-ui/react-switch"
import clsx from "clsx"
import React from "react"

/**
 * A controlled switch component atom.
 */
const Switch = React.forwardRef<HTMLButtonElement, RadixSwitch.SwitchProps>(
  (props, ref) => {
    return (
      <RadixSwitch.Root
        ref={ref}
        {...props}
        className={clsx(
          "h-[18px] w-8 rounded-full bg-gray-300 transition-bg radix-state-checked:bg-violet-60"
        )}
      >
        <RadixSwitch.Thumb
          className={clsx(
            "block h-2 w-2 translate-x-[5px] rounded-full bg-white transition-transform radix-state-checked:translate-x-[19px]"
          )}
        />
      </RadixSwitch.Root>
    )
  }
)

Switch.displayName = "Switch"

export default Switch
