import { Elysia } from 'elysia'

export const ErrorPlugin = new Elysia({ name: 'Error.Handler' })
  .onError(({ error }) => {
    console.error('[Error]', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 400 }
    )
  })
