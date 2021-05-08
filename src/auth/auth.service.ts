import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as OktaJwtVerifier from '@okta/jwt-verifier'

@Injectable()
export class AuthService {
  private oktaVerifier: any
  private audience: string

  constructor(private readonly config: ConfigService) {
    this.oktaVerifier = new OktaJwtVerifier({
      issuer: this.config.get<string>('OKTA_ISSUER'),
      clientId: this.config.get<string>('OKTA_CLIENTID')
    })

    this.audience = this.config.get<string>('OKTA_AUDIENCE')
  }

  async validateToken(token: string): Promise<any> {
    const jwt = await this.oktaVerifier.verifyAccessToken(token, this.audience)
    return jwt
  }
}
