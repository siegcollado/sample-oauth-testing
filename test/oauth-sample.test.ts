import 'jest-extended'
import { oAuthRequest } from './helpers/test-helpers'
import * as jwt from 'jsonwebtoken'

describe('testing oauth credentials', () => {
  describe.each(
    [
      ['KRpatygJ3C5xvWxy4UuLkdm5qXMhCvc5', 'wo-gIcYoQjn-dmGgRe_-pYIZTvgWsA_3tDUOqFLwJpIJdD-wHeDuiQrxrXQor3_X', ['get:clients', 'get:invoices']],
      ['663uIPmEUmVw2T8JVK3S9zoIgmTU4RT4', 'lsyjKKZDmAOKM39m2ry-4DsdF1jQMsdOh6fUInkyiy7NrL-e2tp1WIByFu72wWkm', ['get:clients']],
    ]
  )('given a client id is %p and client secret is %p ', (clientId, clientSecret, allowedScopes) => {

    let responseText: any

    beforeAll(async () => {
      responseText = await oAuthRequest({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience: 'https://test-data-api.com'
      })
    })

    test('response contains the required properties', () => {
      expect(responseText).toEqual(expect.objectContaining({
        access_token: expect.any(String),
        expires_in: expect.any(Number),
        token_type: expect.any(String),
        scope: expect.any(String)
      }))
    })

    test('access_token should decode to a valid jwt', () => {
      expect(() => jwt.decode(responseText['access_token'])).not.toThrow()
    })

    describe('checking JWT properties', () => {
      let decodedValue: any

      beforeEach(() => {
        decodedValue = jwt.decode(responseText['access_token'])
      })

      it('contains a valid iss', () => {
        expect(decodedValue).toEqual(expect.objectContaining({
          iss: 'https://dev-5twd4ss9.auth0.com/'
        }))
      })

      it('contains a valid aud', () => {
        expect(decodedValue).toEqual(expect.objectContaining({
          aud: 'https://test-data-api.com'
        }))
      })

      it('contains a valid expiry value', () => {
        const expiresIn = responseText['expires_in'] as number

        expect(expiresIn).toEqual(expect.any(Number))

        expect(decodedValue).toEqual(expect.objectContaining({
          exp: expect.any(Number),
          iat: expect.any(Number)
        }))

        const { exp, iat } = decodedValue as { exp: number, iat: number }
        const computedExpiry = exp - iat

        expect(computedExpiry).toBe(expiresIn)
      })

      it('contains the correct scopes', () => {
        expect(decodedValue['permissions']).toIncludeSameMembers(allowedScopes)
      })
    })
  })
})
