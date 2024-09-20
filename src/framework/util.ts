import crypto from 'crypto'
import { FlareResponse } from '../extension/types'

export const timingSafeStringCompare = (str1: string, str2: string): boolean => {
	const buffer1 = Buffer.from(str1)
	const buffer2 = Buffer.from(str2)

	if (buffer1.length !== buffer2.length) {
		return false
	}

	return crypto.timingSafeEqual(buffer1, buffer2)
}

export const FlareHttpError = (
	response: FlareResponse,
	statusCode: number,
	errorMessage?: string | object
) => {
	response.status(statusCode).send(errorMessage)
}
