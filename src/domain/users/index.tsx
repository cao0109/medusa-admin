import { ExclamationCircle } from "@medusajs/icons"
import Spinner from "@medusajs/icons/dist/components/spinner"
import { User } from "@medusajs/medusa/dist/models/user"
import { Container, Heading, StatusBadge, Table, Text } from "@medusajs/ui"
import { useAdminUsers } from "medusa-react"
import React from "react"
import { useTranslation } from "react-i18next"
import useToggleState from "../../hooks/use-toggle-state"
import { UserActions } from "./components/action-menu"
import InviteUsersModal from "./modals/invite-users-modal"
import UserEditModal from "./modals/user-edit-modal"

const UsersPage = () => {
  const [currentPage, setCurrentPage] = React.useState(0)
  const pageSize = 16
  const { users, count, isLoading, isError } = useAdminUsers({
    limit: 16,
    offset: currentPage * pageSize,
  })
  const [editUser, setEditUser] = React.useState<User | null>(null)

  const { t } = useTranslation()
  const {
    state: isCreateModalVisible,
    open: showCreateModal,
    close: hideCreateModal,
  } = useToggleState()

  const {
    state: isEditModalVisible,
    open: showEditModal,
    close: hideEditModal,
  } = useToggleState()

  const pageCount = count ? Math.ceil(count / pageSize) : 0
  const canNextPage = React.useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  )
  const canPreviousPage = React.useMemo(
    () => currentPage - 1 >= 0,
    [currentPage]
  )

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const formatMarketplaceRole = (value: string) => {
    if (!value) {
      return ""
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  if (isLoading) {
    return (
      <Container className="mt-8 flex min-h-[320px] items-center justify-center">
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </Container>
    )
  }

  if (isError || !users) {
    return (
      <Container className="mt-8 flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            An error occurred while loading profile details. Reload the page and
            try again. If the issue persists, try again later.
          </Text>
        </div>
      </Container>
    )
  }

  return (
    <>
      <UserEditModal
        isOpen={!!editUser}
        closeModal={() => {
          hideCreateModal()
          setEditUser(null)
        }}
        user={editUser}
      />
      <Container>
        <div className="flex justify-between align-top">
          <div className="flex flex-col gap-y-2">
            <Heading>{t("users-page-title", "Users")}</Heading>
            <Text className="text-ui-fg-subtle">
              {t(
                "users-page-description",
                "Manage details of users on your marketplace."
              )}
            </Text>
          </div>
          <InviteUsersModal />
        </div>

        <Table className="mt-4">
          <Table.Header>
            <Table.Row className="[&_th:last-of-type]:w-[1%]">
              <Table.HeaderCell>
                {t("users-page-email", "Email")}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t("users-page-name", "Name")}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t("users-page-role", "Role")}
              </Table.HeaderCell>
              <Table.HeaderCell className="text-right">
                {t("users-page-status", "Status")}
              </Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user) => {
              return (
                <Table.Row
                  key={user.id}
                  className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                >
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {[user.first_name, user.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </Table.Cell>
                  <Table.Cell>
                    {user.is_admin
                      ? "Admin"
                      : formatMarketplaceRole(user.permission)}
                  </Table.Cell>
                  <Table.Cell className="flex items-center justify-end">
                    <div>
                      {user.status === "active" ? (
                        <StatusBadge color="green">
                          {t("users-page-active", "Active")}
                        </StatusBadge>
                      ) : user.status === "pending" ? (
                        <StatusBadge color="orange">
                          {t("users-page-pending", "Pending")}
                        </StatusBadge>
                      ) : (
                        <StatusBadge color="red">
                          {t("users-page-inactive", "Inactive")}
                        </StatusBadge>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <UserActions
                      user={user as User}
                      onEdit={() => {
                        setEditUser(user as User)
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        <Table.Pagination
          count={count || 0}
          pageSize={pageSize}
          pageIndex={currentPage}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </Container>
    </>
  )
}

export default UsersPage
