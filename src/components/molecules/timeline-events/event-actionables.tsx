import React from "react"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import Actionables, { ActionType } from "../actionables"

type EventActionablesProps = {
  actions: ActionType[]
}

const EventActionables: React.FC<EventActionablesProps> = ({ actions }) => {
  const EventTrigger = (
    <button className="btn-ghost flex items-center justify-center rounded-base px-2xsmall py-0 focus:outline-none focus:ring-2 focus:ring-violet-40">
      <MoreHorizontalIcon size={20} />
    </button>
  )
  return (
    <Actionables customTrigger={EventTrigger} forceDropdown actions={actions} />
  )
}

export default EventActionables
