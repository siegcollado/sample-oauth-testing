import fetch, { Response } from 'node-fetch'

export type OAuthRequestBody = Partial<{
  grant_type: string,
  client_id: string,
  client_secret: string,
  audience: string
}>

export async function oAuthRequest (body: OAuthRequestBody): Promise<Response> {
  return await fetch(process.env.TEST_ENDPOINT_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
