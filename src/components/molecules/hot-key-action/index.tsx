import React from "react"
import { useHotkeys } from "react-hotkeys-hook"

type HotKeyActionProps = {
  label: string
  hotKey: string
  icon: React.ReactNode
  onAction: (keyboardEvent: KeyboardEvent, hotkeysEvent: any) => void | boolean
}

const HotKeyAction = ({ label, hotKey, icon, onAction }: HotKeyActionProps) => {
  useHotkeys(hotKey, onAction, {})
  return (
    <div className="flex items-center gap-2">
      <span className="inter-small-semibold text-grey-0">{label}</span>
      <div className="inter-small-semibold flex h-[24px] w-[24px] items-center justify-center rounded bg-grey-70 text-grey-30">
        {icon}
      </div>
    </div>
  )
}

export default HotKeyAction
