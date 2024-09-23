import { getProperties } from './property'
import { getOasType, FlareOasSchemaObject } from './types'

export abstract class FlareModel {
	schema = () => {
		const schema: FlareOasSchemaObject = {
			type: 'object',
			properties: {},
			required: [],
		}

		const props = getProperties(this)
		props.forEach((prop) => {
			schema.properties[prop.propName] = {
				type: getOasType(prop.type),
				format: prop.format,
				description: prop.description,
			}

			if (prop.isRequired) [schema.required.push(prop.propName)]
		})

		return schema
	}
}
