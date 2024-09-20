import { FlareNext, FlareRequest, FlareResponse } from './types'

/** @internal */
export const registerExpressExtensions = (req: FlareRequest, res: FlareResponse, next: FlareNext) => {
	registerRequestExtensions(req)
	registerResponseExtensions(res)
	next()
}

const registerRequestExtensions = (req: FlareRequest) => {}

const registerResponseExtensions = (res: FlareResponse) => {
	res.xml = (body: any) => {
		res.set('Content-Type', 'text/xml')
		res.send(body)
		return res
	}

	res.renderXml = (template: string, data?: Object) => {
		res.set('Content-Type', 'text/xml')
		res.render(template, data)
		return res
	}
}
