type UserDataType = {
  userId: string,
  userEmail: string,
  userRole: "USER" | "LIBRARIAN" | "CHIEF_LIBRARIAN" | "FINANCE_DIRECTOR",
  userUpdatedDate: string,
  userCreatedDate: string
}

type TokenDataType = {
  accessToken: string,
  refreshToken: string
}