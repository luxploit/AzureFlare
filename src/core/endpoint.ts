import 'reflect-metadata'

const endpointKey = Symbol('endpoint')

type EndpointVerb = 'get' | 'post' | 'put' | 'delete' | 'patch'

interface EndpointMetadata {
	url: string
	verb: EndpointVerb
	methodName: string
}

const defineEndpointDecorator = (url: string, verb: EndpointVerb): MethodDecorator => {
	return (target, propertyKey, _) => {
		let metadata: EndpointMetadata = { url, verb, methodName: String(propertyKey) }

		Reflect.defineMetadata(endpointKey, metadata, target, propertyKey)
	}
}

export const Get = (url: string): MethodDecorator => {
	return defineEndpointDecorator(url, 'get')
}

export const Post = (url: string): MethodDecorator => {
	return defineEndpointDecorator(url, 'post')
}

export const Put = (url: string): MethodDecorator => {
	return defineEndpointDecorator(url, 'put')
}

export const Delete = (url: string): MethodDecorator => {
	return defineEndpointDecorator(url, 'delete')
}

export const Patch = (url: string): MethodDecorator => {
	return defineEndpointDecorator(url, 'patch')
}

export const getRoutes = (instance: any): Array<EndpointMetadata> => {
	const routes: Array<EndpointMetadata> = []

	for (const prop of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
		const route: EndpointMetadata = Reflect.getMetadata(endpointKey, instance, prop)
		if (route) routes.push(route)
	}

	return routes
}
