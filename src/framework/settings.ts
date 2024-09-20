import { Application, Router } from 'express'

export class FlareSettings {
	private settingsKey: string = ''

	constructor(
		private app: Application,
		conKey?: string
	) {
		if (conKey) {
			this.settingsKey = conKey
		}
	}

	key(key: string): this {
		this.settingsKey = key
		return this
	}

	get() {
		return this.app.get(this.settingsKey)
	}

	set(value: any) {
		this.app.set(this.settingsKey, value)
	}

	enable() {
		this.app.enable(this.settingsKey)
	}

	disable() {
		this.app.disable(this.settingsKey)
	}

	local(value?: any) {
		this.app.locals[this.settingsKey] = value
	}

	engine(value?: any) {
		this.app.engine(this.settingsKey, value)
	}
}
