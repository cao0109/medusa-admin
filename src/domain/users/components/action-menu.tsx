import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { User } from "@medusajs/medusa/dist/models/user"
import { DropdownMenu, IconButton, usePrompt } from "@medusajs/ui"
import { useAdminDeleteUser } from "medusa-react"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"

export function UserActions({
  user,
  onEdit,
}: {
  user: User
  onEdit: () => void
}) {
  const promt = usePrompt()
  const { t } = useTranslation()
  const notification = useNotification()

  const { mutate } = useAdminDeleteUser(user.id, {
    onSuccess: () => {
      notification(
        t("new-success", "Success"),
        `User ${user?.email} was deleted`,
        "success"
      )
    },
    onError: () => {
      notification(
        t("new-error", "Error"),
        `Error occured while deleting user ${user?.email}`,
        "error"
      )
    },
  })

  const onDelete = async () => {
    const confirmed = await promt({
      title: t("users-delete-user-confirmation-title", "Are you sure?"),
      description: t(
        "users-delete-user-confirmation-description",
        "Are you sure you want to delete this user?"
      ),
      confirmText: t("users-delete-user-confirmation-confirm", "Delete"),
    })

    if (confirmed) {
      mutate()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2" onClick={onEdit}>
          <PencilSquare className="text-ui-fg-subtle" />
          {t("users-edit-user-action-menu-edit", "Edit")}
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2" onClick={onDelete}>
          <Trash className="text-ui-fg-subtle" />
          {t("users-edit-user-action-menu-delete", "Delete")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
