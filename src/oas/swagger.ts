import { FlareSwaggerOasPaths } from './types'

export interface FlareSwaggerOasInfo {
	title: string
	description?: string
	version: string
}

export interface FlareSwaggerOasServer {
	url: string
	description?: string
}

export interface FlareSwaggerOasConfig {
	openapi: string
	info: FlareSwaggerOasInfo
	servers?: FlareSwaggerOasServer[]
	paths: FlareSwaggerOasPaths
}

export interface FlareSwaggerOasOptions {
	info: FlareSwaggerOasInfo
	servers?: FlareSwaggerOasServer[]
}
