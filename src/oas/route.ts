import { FlareOasResponseObject } from './types'

const oasRouteKey = Symbol('azureflare:oas:route')

export interface FlareOasRoute {
	summary?: string
	responses: Record<number, FlareOasResponseObject>
}

export const OasRoute = (route: FlareOasRoute) => {
	return (target: any, propertyKey: string) => {
		Reflect.defineMetadata(oasRouteKey, route, target, propertyKey)
	}
}

/** @internal */
export const getOasRoutes = (instance: any, propertyKey: string): FlareOasRoute | undefined => {
	return Reflect.getMetadata(oasRouteKey, instance, propertyKey) ?? undefined
}
