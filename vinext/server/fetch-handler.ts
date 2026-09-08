export default {
  async fetch(request: Request, env: { ASSETS?: Fetcher }): Promise<Response> {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request)
    }

    return new Response("Asset binding is not configured.", { status: 500 })
  },
}
