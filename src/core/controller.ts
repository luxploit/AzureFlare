import { EndpointVerb, getRoutes } from './endpoint'
import { FlareExpressApp, FlareExpressRouter, FlareRequest, FlareResponse } from '../extension/types'
import { getMiddlewares } from './middleware'
import { getAuthorization, isAnonymous } from '../authorization/provider'
import { getConfigs } from './config'
import { FlareSettings } from '../framework/settings'
import { getAttributes } from './attributes'
import { getOasRoutes as getOasRoute } from '../oas/route'
import { FlareModel } from '../oas/model'

export abstract class FlareController {
	setup = (app: FlareExpressApp, router?: FlareExpressRouter) => {
		const configs = getConfigs(this)
		configs.forEach((config) => {
			;(this as any)[config](new FlareSettings(app))
		})

		const routes = getRoutes(this)
		routes.forEach((route) => {
			const controllerMiddlewares = getMiddlewares(this)
			const endpointMiddlewares = getMiddlewares(this, route.methodName)
			const middlewares = [...controllerMiddlewares, ...endpointMiddlewares]

			const globalAuth = app.auth
			const routerAuth = router?.auth
			const controllerAuth = getAuthorization(this)
			const endpointAuth = getAuthorization(this, route.methodName)
			const auth = endpointAuth ?? controllerAuth ?? routerAuth ?? globalAuth

			const globalAttributes = app.attributes ?? {}
			const routerAttributes = router?.attributes ?? {}
			const controllerAttributes = getAttributes(this)
			const endpointAttributes = getAttributes(this, route.methodName)
			const attributes = {
				...globalAttributes,
				...routerAttributes,
				...controllerAttributes,
				...endpointAttributes,
			}

			if (auth && !isAnonymous(this) && !isAnonymous(this, route.methodName)) {
				middlewares.unshift(auth.authorize.bind(auth))
			}

			let oasUrl = ''

			if (router) {
				oasUrl = router.routerUrl + route.url
				router[route.verb](
					route.url,
					middlewares,
					(request: FlareRequest, response: FlareResponse) => {
						request.attributes = () => attributes
						;(this as any)[route.methodName](request, response)
					}
				)
			} else {
				oasUrl = route.url
				app[route.verb](
					route.url,
					middlewares,
					(request: FlareRequest, response: FlareResponse) => {
						request.attributes = () => attributes
						;(this as any)[route.methodName](request, response)
					}
				)
			}

			const oasRouteSpec = getOasRoute(this, route.methodName)
			if (oasRouteSpec) {
				for (const rtSpec in oasRouteSpec.responses) {
					const resp = oasRouteSpec.responses[rtSpec]
					for (const contents in resp.content) {
						const model = (new resp.content[contents]() as FlareModel).schema()
						resp.content[contents] = model
					}
				}

				app.swagger! = { [oasUrl]: { [route.verb]: oasRouteSpec } }
			}
		})
	}
}
