import { useAdminCustomer } from "medusa-react"
import moment from "moment"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import Avatar from "../../../components/atoms/avatar"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import Section from "../../../components/organisms/section"
import CustomerOrdersTable from "../../../components/templates/customer-orders-table"
import { getErrorStatus } from "../../../utils/get-error-status"
import EditCustomerModal from "./edit"

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { customer, isLoading, error } = useAdminCustomer(id!)
  const { t } = useTranslation()
  const [showEdit, setShowEdit] = useState(false)

  const customerName = () => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name} ${customer.last_name}`
    } else {
      return customer?.email
    }
  }

  const actions: ActionType[] = [
    {
      label: t("details-edit", "Edit"),
      onClick: () => setShowEdit(true),
      icon: <EditIcon size={20} />,
    },
  ]

  if (error) {
    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }

  if (isLoading || !customer) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div>
      <BackButton
        label={t("details-back-to-customers", "Back to Customers")}
        path="/a/customers"
        className="mb-xsmall"
      />
      <div className="flex flex-col gap-y-xsmall">
        <Section>
          <div className="flex w-full items-start justify-between">
            <div className="flex w-full items-center gap-x-base">
              <div className="h-[64px] w-[64px]">
                <Avatar
                  user={customer}
                  font="inter-2xlarge-semibold w-full h-full"
                  color="bg-fuschia-40"
                />
              </div>
              <div className="flex grow flex-col">
                <h1 className="inter-xlarge-semibold max-w-[50%] truncate text-grey-90">
                  {customerName()}
                </h1>
                <h3 className="inter-small-regular text-grey-50">
                  {customer.email}
                </h3>
              </div>
            </div>
            <Actionables actions={actions} forceDropdown />
          </div>
          <div className="mt-6 flex space-x-6 divide-x">
            <div className="flex flex-col">
              <div className="inter-smaller-regular mb-1 text-grey-50">
                {t("details-first-seen", "First seen")}
              </div>
              <div>{moment(customer.created_at).format("DD MMM YYYY")}</div>
            </div>
            <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular mb-1 text-grey-50">
                {t("details-phone", "Phone")}
              </div>
              <div className="max-w-[200px] truncate">
                {customer.phone || "N/A"}
              </div>
            </div>
            <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular mb-1 text-grey-50">
                {t("details-orders", "Orders")}
              </div>
              <div>{customer.orders.length}</div>
            </div>
            <div className="h-100 flex flex-col pl-6">
              <div className="inter-smaller-regular mb-1 text-grey-50">
                {t("details-user", "User")}
              </div>
              <div className="h-50 flex items-center justify-center">
                <StatusDot
                  variant={customer.has_account ? "success" : "danger"}
                  title={customer.has_account ? "Registered" : "Guest"}
                />
              </div>
            </div>
          </div>
        </Section>
        <BodyCard
          title={t("details-orders", "Orders {{count}}", {
            count: customer.orders.length,
          })}
          subtitle={t(
            "details-an-overview-of-customer-orders",
            "An overview of Customer Orders"
          )}
        >
          <div className="flex  grow flex-col">
            <CustomerOrdersTable id={customer.id} />
          </div>
        </BodyCard>

        <RawJSON
          data={customer}
          title={t("details-raw-customer", "Raw customer")}
        />
      </div>

      {showEdit && customer && (
        <EditCustomerModal
          customer={customer}
          handleClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

export default CustomerDetail
