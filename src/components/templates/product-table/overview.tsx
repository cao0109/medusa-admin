import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import { Link } from "react-router-dom"
import { getProductStatusVariant } from "../../../utils/product-status-variant"
import Button from "../../fundamentals/button"
import ListIcon from "../../fundamentals/icons/list-icon"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import Actionables from "../../molecules/actionables"
import useProductActions from "./use-product-actions"

type ProductOverviewProps = {
  products?: Product[]
  toggleListView: () => void
}

const ProductOverview = ({
  products,
  toggleListView,
}: ProductOverviewProps) => {
  return (
    <>
      <div className="flex justify-end border-t border-b border-grey-20 py-2.5 pr-xlarge">
        <div className="inter-small-semibold flex justify-self-end text-grey-50">
          <span
            onClick={toggleListView}
            className={clsx(
              "cursor-pointer rounded p-0.5 text-grey-40 hover:bg-grey-5"
            )}
          >
            <ListIcon size={20} />
          </span>
          <span
            className={clsx(
              "cursor-pointer rounded p-0.5 text-grey-90 hover:bg-grey-5"
            )}
          >
            <TileIcon size={20} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6">
        {products?.map((product) => (
          <ProductTile product={product} />
        ))}
      </div>
    </>
  )
}

const ProductTile = ({ product }) => {
  const { getActions } = useProductActions(product)

  return (
    <div className="group flex-col rounded-rounded p-base hover:bg-grey-5">
      <div className="relative">
        <div
          className={clsx("absolute top-2 right-2 inline-block rounded-base")}
        >
          <Actionables
            actions={getActions()}
            customTrigger={
              <Button
                variant="ghost"
                size="small"
                className="hidden-actions h-xlarge w-xlarge bg-grey-0 opacity-0 focus-within:opacity-100 group-hover:opacity-100"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
        <Link to={`${product.id}`}>
          {product.thumbnail ? (
            <img
              className="block min-h-[230px] rounded-rounded object-cover"
              src={product.thumbnail}
            />
          ) : (
            <div className="flex min-h-[230px] items-center justify-center rounded-rounded bg-grey-5">
              <ImagePlaceholder />
            </div>
          )}
          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular mr-3 text-grey-90 line-clamp-1">
                {product.title}
              </p>
              <StatusIndicator
                variant={getProductStatusVariant(product.status)}
                className="shrink-0"
              />
            </div>
            <span className="inter-small-regular text-grey-50 line-clamp-1">
              {product.collection?.title}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProductOverview
