import 'reflect-metadata'

const attributeKey = Symbol('attribute')

export type FlareAttributes = Record<string, any | null>

export const Attribute = (key: string, value?: any): MethodDecorator & ClassDecorator => {
	return (target: any, propertyKey?: string | symbol) => {
		if (propertyKey) {
			const existingAttributes: FlareAttributes =
				Reflect.getMetadata(attributeKey, target, propertyKey) || []

			Reflect.defineMetadata(
				attributeKey,
				{ ...{ key: value }, ...existingAttributes },
				target,
				propertyKey
			)
		} else {
			const existingAttributes: FlareAttributes = Reflect.getMetadata(attributeKey, target) || []

			Reflect.defineMetadata(attributeKey, { ...{ key: value }, ...existingAttributes }, target)
		}
	}
}

/** @internal */
export const getAttributes = (target: any, propertyKey?: string | symbol): FlareAttributes => {
	if (propertyKey) {
		return Reflect.getMetadata(attributeKey, target, propertyKey) || []
	} else {
		return Reflect.getMetadata(attributeKey, target) || []
	}
}
