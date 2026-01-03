import { t } from 'elysia'

export const UserModel = {
  create: t.Object({
    name: t.String(),
    email: t.String().optional()
  })
}

export namespace UserModel {
  export type Create = typeof UserModel.create.static
}
