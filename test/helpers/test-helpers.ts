import fetch, { Response } from 'node-fetch'

export type OAuthRequestBody = Partial<{
  grant_type: string,
  client_id: string,
  client_secret: string,
  audience: string
}>

export async function oAuthRequest (body: OAuthRequestBody): Promise<Response> {
  return await fetch('https://dev-5twd4ss9.auth0.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
