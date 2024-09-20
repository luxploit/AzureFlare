import { RequestHandler } from 'express'
import 'reflect-metadata'

const middlewareKey = Symbol('middleware')

export const Middleware = (...middlewares: RequestHandler[]): MethodDecorator & ClassDecorator => {
	return (target: any, propertyKey?: string | symbol) => {
		if (propertyKey) {
			const existingMiddlewares: RequestHandler[] =
				Reflect.getMetadata(middlewareKey, target, propertyKey) || []

			Reflect.defineMetadata(
				middlewareKey,
				[...middlewares, ...existingMiddlewares],
				target,
				propertyKey
			)
		} else {
			const existingMiddlewares: RequestHandler[] =
				Reflect.getMetadata(middlewareKey, target.prototype) || []

			Reflect.defineMetadata(
				middlewareKey,
				[...middlewares, ...existingMiddlewares],
				target.prototype
			)
		}
	}
}

export const getMiddlewares = (target: any, propertyKey?: string | symbol): RequestHandler[] => {
	if (propertyKey) {
		return Reflect.getMetadata(middlewareKey, target, propertyKey) || []
	} else {
		return Reflect.getMetadata(middlewareKey, target) || []
	}
}
