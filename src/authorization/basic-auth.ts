import { FlareAuthorizationProvider } from './provider'
import { FlareHttpError as FlareHttpError, timingSafeStringCompare } from '../framework/util'
import { FlareRequest, FlareResponse, FlareNext } from '../extension/types'

export interface FlareBasicAuthCredentials {
	username: string
	password: string
}

export interface FlareBasicAuthOptions {
	credentials: FlareBasicAuthCredentials[]
	realm: string
	portal: boolean
}

export class FlareBasicAuthorization extends FlareAuthorizationProvider {
	options: FlareBasicAuthOptions

	constructor(options: FlareBasicAuthOptions) {
		super()

		this.options = options
		this.authorize = this.authorize.bind(this)
	}

	authorize = (request: FlareRequest, response: FlareResponse, next: FlareNext) => {
		const promptBrowser = () => {
			if (this.options.portal)
				response.setHeader('WWW-Authenticate', `Basic realm="${this.options.realm}"`)
		}

		const isValid = (credentials: FlareBasicAuthCredentials) => {
			return timingSafeStringCompare(
				inner_credentials,
				`${credentials.username}:${credentials.password}`
			)
		}

		const basicHeader = request.get('Authorization')

		if (!basicHeader) {
			promptBrowser()
			return FlareHttpError(response, 401, 'Authorization Required!')
		}

		const inner_credentials = Buffer.from(basicHeader.split(' ')[1], 'base64').toString()

		if (!this.options.credentials.some(isValid)) {
			promptBrowser()
			return FlareHttpError(response, 401, 'Authorization Failed!')
		}

		return next()
	}
}
