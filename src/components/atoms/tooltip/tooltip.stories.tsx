import { ComponentMeta, ComponentStory } from "@storybook/react"
import clsx from "clsx"
import React from "react"
import Tooltip from "."

export default {
  title: "Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    triggerPosition: {
      options: [
        "top left",
        "top right",
        "top center",
        "center center",
        "center right",
        "center left",
        "bottom left",
        "bottom right",
        "bottom center",
      ],
      control: {
        type: "select",
      },
      defaultValue: "top left",
    },
  },
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<any> = ({ triggerPosition, ...props }) => {
  return (
    <div
      className={clsx(
        {
          ["content-start justify-start"]: triggerPosition === "top left",
          ["content-start justify-center"]: triggerPosition === "top center",
          ["content-start justify-end"]: triggerPosition === "top right",
          ["content-center justify-start"]: triggerPosition === "center left",
          ["place-content-center"]: triggerPosition === "center center",
          ["content-center justify-end"]: triggerPosition === "center right",
          ["content-end justify-start"]: triggerPosition === "bottom left",
          ["content-end justify-center"]: triggerPosition === "bottom center",
          ["content-end justify-end"]: triggerPosition === "bottom right",
        },
        "grid min-h-full"
      )}
    >
      <Tooltip {...props}>
        <button className="btn btn-secondary btn-medium">hover!</button>
      </Tooltip>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  content: "Tags are one word descriptors for the product used for searches",
  sideOffset: 10,
}

export const Controlled = Template.bind({})
Controlled.args = {
  open: true,
  content: "Tags are one word descriptors for the product used for searches",
  sideOffset: 10,
}
