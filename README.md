# AzureFlare

A highly opinionated Web Framework built on top of Express.js

## Installation

Use your package manager of choice (example with [`pnpm`](https://pnpm.io/))

```bash
pnpm add @lxpt/azureflare
```

## Contributing

Just open a PR, any new features and additions are Welcome!

## Usage / Examples

**More extensive examples as well as the full API reference can be found at \<website soon™>**

Basic example using controllers

```typescript
// controllers/test.ts

export class TestController extends FlareController {
	@Get('/test')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.send('Welcome to AzureFlare! Ping Pong')
	}
}

// main.ts

const flare = new FlareApp()

flare.useController(new TestController())
flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```

### Middleware

Controllers with Global Middleware

```typescript
// middlewares/testkey.ts

export function LogMiddlewareTest(req: FlareRequest, res: FlareResponse, next: FlareNext) {
	console.log('Global Middleware Test! x-middleware-msg:', req.get('x-middleware-msg'))

	next()
}

// controllers/test.ts

export class TestController extends FlareController {
	@Get('/test')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.send('Welcome to AzureFlare! Ping Pong')
	}
}

// main.ts

const flare = new FlareApp()

flare.useMiddleware(LogMiddlewareTest)
flare.useController(new TestController())
flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```

Controllers with Scoped middleware

```typescript
// middlewares/testkey.ts

export function LogMiddlewareTest(req: FlareRequest, res: FlareResponse, next: FlareNext) {
	console.log('Controller Middleware Test! x-middleware-msg:', req.get('x-middleware-msg'))

	next()
}

// controllers/test.ts

@Middleware(LogMiddlewareTest)
export class TestController extends FlareController {
	@Get('/test')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.send('Welcome to AzureFlare! Ping Pong')
	}
}

// main.ts

const flare = new FlareApp()
flare.useController(new TestController())

flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```

Controllers with Route Scoped Middleware

```typescript
// middlewares/testkey.ts

export function LogMiddlewareTest(req: FlareRequest, res: FlareResponse, next: FlareNext) {
	console.log('Route Middleware Test! x-middleware-msg:', req.get('x-middleware-msg'))

	next()
}

// controllers/test.ts

export class TestController extends FlareController {
	@Middleware(LogMiddlewareTest)
	@Get('/test')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.send('Welcome to AzureFlare! Ping Pong')
	}
}

// main.ts

const flare = new FlareApp()
flare.useController(new TestController())

flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```

### Authorization

Given these two routes (one guarded, one anonymous)

```typescript
// controllers/test.ts

export class TestController extends FlareController {
	@Get('/test')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.send('Welcome to AzureFlare! Ping Pong, this route is guarded!')
	}
}

// controller/fancy.ts

export class FancyController extends FlareController {
	@Anonymous()
	@Get('/fancy-test')
	public GetFancyTest(req: FlareRequest, res: FlareResponse) {
		res.send('<em>Welcome to AzureFlare, the fancy framework for express!</em>')
	}
}
```

Controllers with Basic Authorization

```typescript
// main.ts

const flare = new FlareApp()

flare.useAuthorization(
	new FlareBasicAuthorization({
		credentials: [
			{
				username: 'someUsername',
				password: 'somePassword',
			},
		],
		realm: 'flare-realm',
		portal: true,
	})
)
flare.useControllers([new TestController(), new FancyController()])

flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```

Controllers with Secret Token Authorization

```typescript
// main.ts

const flare = new FlareApp()

flare.useAuthorization(
	new FlareSecretTokenAuthorization({
		header: 'x-secret-token',
		token: 'super-secret-token',
	})
)
flare.useControllers([new TestController(), new FancyController()])

flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```

### Attributable Data

Controllers with attribute data per route

```typescript
// middlewares/has_banana.ts

export function HasBananaAttributeMiddleware(req: FlareRequest, res: FlareResponse, next: FlareNext) {
	const attrs = req.attributes!()
	const fruit = attrs['fruit']

	if (!fruit) {
		console.log(
			fruit === 'banana'
				? `${req.originalUrl} has a banana`
				: `There are only ${fruit} at ${req.originalUrl}`
		)
	} else {
		console.log(`There are no fruits at ${req.originalUrl}`)
	}

	next()
}

// controllers/banana.ts

export class BananaController extends FlareController {
	@Get('/banana')
	@Attribute('fruit', 'banana')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.sendStatus(200)
	}
}

// controllers/kiwi.ts

export class KiwiController extends FlareController {
	@Get('/kiwi')
	@Attribute('fruit', 'kiwi')
	public GetTest(req: FlareRequest, res: FlareResponse) {
		res.sendStatus(200)
	}
}

// main.ts

const flare = new FlareApp()

flare.useMiddleware(HasBananaAttributeMiddleware)
flare.useControllers([new BananaController(), new KiwiController()])

flare.build().listen(3000, () => {
	console.log('AzureFlare Demo is Running!')
})
```
