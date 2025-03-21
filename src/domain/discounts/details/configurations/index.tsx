import { Discount } from "@medusajs/medusa"
import React from "react"
import { useTranslation } from "react-i18next"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import NumberedItem from "../../../../components/molecules/numbered-item"
import BodyCard from "../../../../components/organisms/body-card"
import useToggleState from "../../../../hooks/use-toggle-state"
import EditConfigurations from "./edit-configurations"
import useDiscountConfigurations from "./use-discount-configurations"

type ConfigurationsProps = {
  discount: Discount
}

const Configurations: React.FC<ConfigurationsProps> = ({ discount }) => {
  const { t } = useTranslation()
  const configurations = useDiscountConfigurations(discount)
  const { state, open, close } = useToggleState()

  return (
    <>
      <BodyCard
        title={t("configurations-configurations", "Configurations")}
        className="min-h-[200px]"
        actionables={[
          {
            label: t(
              "configurations-edit-configurations",
              "Edit configurations"
            ),
            onClick: open,
            icon: <EditIcon size={20} />,
          },
        ]}
        forceDropdown
      >
        <div
          style={{
            gridTemplateRows: `repeat(${Math.ceil(
              configurations.length / 2
            )}, minmax(0, 1fr))`,
          }}
          className="grid grid-flow-col grid-cols-2 gap-y-base gap-x-xlarge"
        >
          {configurations.map((setting, i) => (
            <NumberedItem
              key={i}
              title={setting.title}
              index={i + 1}
              description={setting.description}
              actions={setting.actions}
            />
          ))}
        </div>
      </BodyCard>

      <EditConfigurations discount={discount} onClose={close} open={state} />
    </>
  )
}

export default Configurations
