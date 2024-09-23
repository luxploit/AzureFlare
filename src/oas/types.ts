import { FlareOasRoute } from './route'

type OasType = 'string' | 'number' | 'boolean' | 'array' | 'object'

// export type FlareOasFormat =
// 	| 'int32'
// 	| 'int64'
// 	| 'float'
// 	| 'double'
// 	| 'byte'
// 	| 'binary'
// 	| 'boolean'
// 	| 'date'
// 	| 'date-time'
// 	| 'password'

/** @internal */
export const getOasType = (type: any): OasType => {
	switch (type) {
		case String:
			return 'string'
		case Number:
			return 'number'
		case Boolean:
			return 'boolean'
		case Array:
			return 'array'
		default:
			return 'object'
	}
}

interface OasSchemaPropertiesObject {
	type: OasType
	format?: string
	description?: string
}

export interface FlareOasSchemaObject {
	type: OasType
	properties: Record<string, OasSchemaPropertiesObject>
	required: string[]
}

export interface FlareOasResponseObject {
	description?: string
	content: Record<string, any>
}

/** @internal */
export interface OasPropertyObject {
	propName: string
	type: any
	isRequired: boolean
	description?: string
	format?: string
}

export type FlareSwaggerOasPaths = Record<
	string,
	Record<string /* EndpointVerb <- causes funny error*/, FlareOasRoute>
>
