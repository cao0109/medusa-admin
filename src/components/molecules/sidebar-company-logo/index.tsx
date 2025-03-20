import React from "react"

type SidebarCompanyLogoProps = {
  storeName?: string
}

const SidebarCompanyLogo: React.FC<SidebarCompanyLogoProps> = ({
  storeName,
}: SidebarCompanyLogoProps) => {
  return (
    <div className="mb-4 flex w-full items-center bg-grey-0 px-2.5 pb-6">
      <div className="flex h-[32px] w-[32px] items-center justify-center rounded bg-grey-90 text-grey-0">
        <div>{storeName?.slice(0, 1) || "M"}</div>
      </div>
      <span className="ml-2.5 font-semibold">{storeName}</span>
    </div>
  )
}

export default SidebarCompanyLogo
