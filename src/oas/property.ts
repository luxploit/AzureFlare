import { OasPropertyObject } from './types'

const oasPropKey = Symbol('azureflare:oas:property')

export interface FlareOasPropertyOptions {
	isRequired?: boolean
	description?: string
	format?: string
}

export const OasProperty = ({ isRequired, description, format }: FlareOasPropertyOptions) => {
	return (target: any, propertyKey: string) => {
		let metadata: OasPropertyObject = {
			propName: String(propertyKey),
			type: target,
			isRequired: false,
		}

		const oasDesc = description
		if (oasDesc) {
			metadata.description = oasDesc
		}

		const oasFmt = format
		if (oasFmt) {
			metadata.format = oasFmt
		}

		const oasRequired = isRequired
		if (oasRequired) {
			metadata.isRequired = true
		}

		Reflect.defineMetadata(oasPropKey, metadata, target, propertyKey)
	}
}

/** @internal */
export const getProperties = (instance: any) => {
	const properties: Array<OasPropertyObject> = []

	for (const prop of Object.getOwnPropertyNames(instance)) {
		const property: OasPropertyObject = Reflect.getMetadata(oasPropKey, instance, prop)
		if (property) properties.push(property)
	}

	return properties
}
