import React from "react"
import { Toaster } from "react-hot-toast"
import Sidebar from "../organisms/sidebar"
import Topbar from "../organisms/topbar"
import { PollingProvider } from "../../context/polling"

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="inter-base-regular flex h-screen w-full text-grey-90">
      <Toaster
        containerStyle={{
          top: 74,
          left: 24,
          bottom: 24,
          right: 24,
        }}
      />
      <Sidebar />
      <PollingProvider>
        <div className="flex flex-1 flex-col">
          <Topbar />
          <div className="min-h-content overflow-y-auto bg-grey-5 py-xlarge large:px-xlarge">
            <main className="h-full xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:w-full large:max-w-7xl">
              {children}
            </main>
          </div>
        </div>
      </PollingProvider>
    </div>
  )
}

export default Layout
