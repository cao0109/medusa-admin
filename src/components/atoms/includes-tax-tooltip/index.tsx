import clsx from "clsx"
import TaxesIcon from "../../fundamentals/icons/taxes-icon"
import Tooltip from "../tooltip"

type Props = {
  includesTax?: boolean
}

const IncludesTaxTooltip = ({ includesTax }: Props) => {
  return (
    <Tooltip content={includesTax ? "Tax incl. price" : "Tax excl. price"}>
      <div className="flex h-large w-large items-center justify-center rounded-rounded border border-grey-20">
        <TaxesIcon
          size={16}
          className={clsx({
            "text-grey-50": includesTax,
            "text-grey-30": !includesTax,
          })}
        />
      </div>
    </Tooltip>
  )
}

export default IncludesTaxTooltip
