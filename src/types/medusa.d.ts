export enum UserStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
}

export enum UserPermission {
  ADMIN = "admin",
  VENDOR = "vendor",
  SELLER = "seller",
}

declare module "@medusajs/medusa" {
  interface User {
    store_id: string | null
    store: Store | null
    status: UserStatus
    is_admin: boolean
    permission: UserPermission
  }

  interface AdminPostProductCategoriesReq {
    image: string
  }

  // AdminPostProductCategoriesCategoryReq
  interface AdminPostProductCategoriesCategoryReq {
    image: string
  }
}
