import { oAuthRequest } from './helpers/test-helpers'
import * as jwt from 'jsonwebtoken'
describe('testing oauth credentials', () => {
  describe('happy path', () => {

    let responseText: any

    beforeAll(async () => {
      responseText = await oAuthRequest({
        grant_type: 'client_credentials',
        client_id: 'KRpatygJ3C5xvWxy4UuLkdm5qXMhCvc5',
        client_secret: 'wo-gIcYoQjn-dmGgRe_-pYIZTvgWsA_3tDUOqFLwJpIJdD-wHeDuiQrxrXQor3_X',
        audience: 'https://test-data-api.com'
      })
    })

    it('should be a valid jwt', () => {
      expect(() => jwt.decode(responseText['access_token'])).not.toThrow()
    })

    describe('checking for properties', () => {
      let decodedValue: unknown

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
    })
  })
})
