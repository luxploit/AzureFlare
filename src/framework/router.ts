import express, { Application, RequestHandler, Router } from 'express'
import { FlareAuthorizationProvider } from '../authorization/provider'
import { FlareController } from '../core/controller'
import { FlareSettings } from '../framework/settings'
import { FlareExpressApp, FlareExpressRouter } from '../extension/types'

export class FlareRouter {
	private readonly router: FlareExpressRouter
	private middlewares: RequestHandler[] = []

	constructor(
		private readonly app: FlareExpressApp,
		private readonly routerUrl: string
	) {
		this.router = Router()
		this.router.routerUrl = routerUrl
	}

	useAuthorization(auth: FlareAuthorizationProvider): this {
		this.router.auth = auth
		return this
	}

	useMiddleware(middleware: RequestHandler): this {
		this.middlewares.push(middleware)
		return this
	}

	useMiddlewares(middlewares: RequestHandler[]): this {
		this.middlewares = [...this.middlewares, ...middlewares]
		return this
	}

	useController(controller: FlareController): this {
		controller.setup(this.app, this.router)
		return this
	}

	useControllers(controllers: FlareController[]): this {
		controllers.forEach((controller) => controller.setup(this.app, this.router))
		return this
	}

	usePublic(virtualPath: string, rootPath: string): this {
		this.router.use(virtualPath, express.static(rootPath))
		return this
	}

	useAppSettings(key: string): FlareSettings {
		return new FlareSettings(this.app, key)
	}

	build(): FlareExpressRouter {
		this.middlewares.forEach((middleware) => this.router.use(middleware))
		return this.router
	}
}

type FlareRouterInitializer = (app: FlareRouter) => void
export const createFlareRouter =
	(initializer: FlareRouterInitializer) => (app: FlareExpressApp, url: string) => {
		const router = new FlareRouter(app, url)
		initializer(router)
		return router.build()
	}
