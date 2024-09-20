import { FlareNext, FlareRequest, FlareResponse } from '../extension/types'
import 'reflect-metadata'

const providerKey = Symbol('provider')
const anonymousKey = Symbol('anonymous')

export abstract class FlareAuthorizationProvider {
	abstract authorize(request: FlareRequest, response: FlareResponse, next: FlareNext): void
}

export const Authorize = (provider: FlareAuthorizationProvider): MethodDecorator & ClassDecorator => {
	return (target: any, propertyKey?: string | symbol) => {
		if (propertyKey) {
			Reflect.defineMetadata(providerKey, provider, target, propertyKey)
		} else {
			Reflect.defineMetadata(providerKey, provider, target)
		}
	}
}

export const Anonymous = (): MethodDecorator & ClassDecorator => {
	return (target: any, propertyKey?: string | symbol) => {
		if (propertyKey) {
			Reflect.defineMetadata(anonymousKey, true, target, propertyKey)
		} else {
			Reflect.defineMetadata(anonymousKey, true, target)
		}
	}
}

/** @internal */
export const getAuthorization = (
	target: any,
	propertyKey?: string | symbol
): FlareAuthorizationProvider | undefined => {
	if (propertyKey) {
		return Reflect.getMetadata(providerKey, target, propertyKey) || undefined
	} else {
		return Reflect.getMetadata(providerKey, target) || undefined
	}
}

/** @internal */
export const isAnonymous = (target: any, propertyKey?: string | symbol): boolean => {
	if (propertyKey) {
		return !!Reflect.getMetadata(anonymousKey, target, propertyKey)
	} else {
		return !!Reflect.getMetadata(anonymousKey, target)
	}
}
