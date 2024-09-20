import { FlareRequest, FlareResponse, FlareNext } from '../extension/types'
import { timingSafeStringCompare, FlareHttpError } from '../framework/util'
import { FlareAuthorizationProvider } from './provider'

export interface FlareSecretTokenOptions {
	header: string
	token: string
}

export class FlareSecretTokenAuthorization extends FlareAuthorizationProvider {
	options: FlareSecretTokenOptions

	constructor(options: FlareSecretTokenOptions) {
		super()

		this.options = options
		this.authorize = this.authorize.bind(this)
	}

	authorize = (request: FlareRequest, response: FlareResponse, next: FlareNext) => {
		const isValid = (secret: string) => {
			return timingSafeStringCompare(this.options.token, secret)
		}

		const authHeader = request.get(this.options.header)

		if (!authHeader) {
			return FlareHttpError(response, 401, 'Authorization Required!')
		}

		if (!isValid(authHeader)) {
			return FlareHttpError(response, 401, 'Authorization Failed!')
		}

		return next()
	}
}
