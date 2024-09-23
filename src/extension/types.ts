import { Application, NextFunction, Request, Response, Router } from 'express'
import { FlareAuthorizationProvider } from '../authorization/provider'
import { FlareAttributes } from '../core/attributes'
import { FlareSwaggerOasPaths } from '../oas/types'

export interface FlareRequest extends Request {
	attributes?: () => FlareAttributes // registered in core/Controller.ts:49 (router) & core/Controller.ts:60 (app)
}

export interface FlareResponse extends Response {
	xml?: (body: any) => this
	renderXml?: (template: string, data?: Object) => this
	error?: (code: number, message?: string | Object) => this
}

export interface FlareNext extends NextFunction {}

export interface FlareExpressApp extends Application {
	swagger?: FlareSwaggerOasPaths
	auth?: FlareAuthorizationProvider
	attributes?: FlareAttributes
}

export interface FlareExpressRouter extends Router {
	routerUrl?: string
	auth?: FlareAuthorizationProvider
	attributes?: FlareAttributes
}
