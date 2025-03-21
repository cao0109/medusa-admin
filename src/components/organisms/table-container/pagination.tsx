import { useTranslation } from "react-i18next"
import { SkeletonProvider } from "../../../providers/skeleton-provider"
import Skeleton from "../../atoms/skeleton"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import { PagingProps } from "./types"

type Props = {
  isLoading?: boolean
  pagingState: PagingProps
}

export const TablePagination = ({
  isLoading = false,
  pagingState: {
    title,
    currentPage,
    pageCount,
    pageSize,
    count,
    offset,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  },
}: Props) => {
  const { t } = useTranslation()
  const soothedOffset = count > 0 ? offset + 1 : 0
  const soothedPageCount = Math.max(1, pageCount)

  return (
    <SkeletonProvider isLoading={isLoading}>
      <div
        className={
          "inter-small-regular flex w-full justify-between text-grey-50"
        }
      >
        <Skeleton>
          <div>
            {t(
              "table-container-soothed-offset",
              "{{soothedOffset}} - {{pageSize}} of {{count}} {{title}}",
              {
                soothedOffset,
                pageSize,
                count,
                title,
              }
            )}
          </div>
        </Skeleton>
        <div className="flex space-x-4">
          <Skeleton>
            <div>
              {t(
                "table-container-current-page",
                "{{currentPage}} of {{soothedPageCount}}",
                {
                  currentPage,
                  soothedPageCount,
                }
              )}
            </div>
          </Skeleton>
          <div className="flex items-center space-x-4">
            <button
              className="cursor-pointer disabled:cursor-default disabled:text-grey-30"
              disabled={!hasPrev || isLoading}
              onClick={() => prevPage()}
            >
              <ArrowLeftIcon />
            </button>
            <button
              className="cursor-pointer disabled:cursor-default disabled:text-grey-30"
              disabled={!hasNext || isLoading}
              onClick={() => nextPage()}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </SkeletonProvider>
  )
}
