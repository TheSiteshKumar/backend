import { t } from 'elysia'

export const AuthModel = {
  login: t.Object({
    username: t.String(),
    password: t.String()
  })
}

export namespace AuthModel {
  export type Login = typeof AuthModel.login.static
}
