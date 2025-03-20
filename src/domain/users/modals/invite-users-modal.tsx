import { UserRoles } from "@medusajs/medusa"
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Select,
  Text,
  useToggleState,
} from "@medusajs/ui"
import { useAdminCreateInvite } from "medusa-react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"

type InviteUsersModal = {
  email: string
  role: UserRoles
}

const InviteUsersModal = () => {
  const form = useForm<InviteUsersModal>({
    defaultValues: getDefaultValues(),
  })
  const notification = useNotification()
  const { t } = useTranslation()

  const { toggle, state, close } = useToggleState()

  const { mutate, isLoading } = useAdminCreateInvite()

  const onReset = () => {
    form.reset(getDefaultValues())
    close()
  }

  const onSubmit = form.handleSubmit(async (data) => {
    mutate(
      { role: data.role as UserRoles, user: data.email },
      {
        onSuccess: () => {
          notification(
            t("new-success", "Success"),
            `User ${data.email} was invited`,
            "success"
          )
          onReset()
        },
        onError: (error) => {
          notification(
            t("new-error", "Error"),
            "Error occured while inviting user",
            "error"
          )
        },
      }
    )
  })

  return (
    <FocusModal open={state} onOpenChange={toggle}>
      <FocusModal.Trigger>
        <Button variant="secondary">
          {t("users-invite-administrators") || "Invite administrators"}
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <form onSubmit={onSubmit}>
          <FocusModal.Header>
            <Button isLoading={isLoading}>
              {t("users-invite-administrators") || "Invite administrators"}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>
                  {t("users-invite-administrators") || "Invite administrators"}
                </Heading>
                <Text className="text-ui-fg-subtle">
                  {t(
                    "users-invite-administrators-description",
                    "Invite administators to your team"
                  )}
                </Text>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="email" className="text-ui-fg-subtle">
                    {t("users-page-email", "Email")}
                  </Label>
                  <Input
                    id="email"
                    placeholder="member@medusa-test.com"
                    {...form.register("email", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="last_name" className="text-ui-fg-subtle">
                    {t("users-page-role", "Role")}
                  </Label>
                  <Controller
                    name="role"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...other } }) => (
                      <Select {...other} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Select status" />
                        </Select.Trigger>
                        <Select.Content>
                          {roles.map((item) => (
                            <Select.Item key={item.value} value={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </form>
      </FocusModal.Content>
    </FocusModal>
  )
}

const roles = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Member",
    value: "member",
  },
  {
    label: "Developer",
    value: "developer",
  },
]

const getDefaultValues = (): InviteUsersModal => {
  return {
    email: "",
    role: "admin" as UserRoles,
  }
}

export default InviteUsersModal
