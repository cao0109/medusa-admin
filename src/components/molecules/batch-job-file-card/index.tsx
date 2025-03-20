import React, { ReactNode } from "react"

type Props = {
  fileName: string
  fileSize?: string
  icon?: ReactNode
  onClick?: () => void
}

const BatchJobFileCard = ({ fileName, fileSize, icon, onClick }: Props) => {
  const preparedOnClick = onClick ?? (() => void 0)

  return (
    <div
      className="mt-4 flex w-full cursor-pointer items-center"
      onClick={preparedOnClick}
    >
      <div
        className="flex items-center justify-center rounded-lg border border-grey-20 p-2.5"
        title={fileName}
      >
        {!!icon && icon}
      </div>

      <div className="relative w-full pl-4 text-left">
        <div className="inter-small-regular max-w-[80%] overflow-hidden truncate">
          {fileName}
        </div>

        {!!fileSize && (
          <div className="inter-small-regular text-grey-40">{fileSize}</div>
        )}
      </div>
    </div>
  )
}

export default BatchJobFileCard
