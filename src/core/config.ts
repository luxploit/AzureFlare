const configKey = Symbol('config')

export const Config = (): MethodDecorator => {
	return (target, propertyKey, _) => {
		Reflect.defineMetadata(configKey, String(propertyKey), target, propertyKey)
	}
}

export const getConfigs = (instance: any): Array<string> => {
	const configs: Array<string> = []

	for (const prop of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
		const config: string = Reflect.getMetadata(configKey, instance, prop)
		if (config) configs.push(config)
	}

	return configs
}
