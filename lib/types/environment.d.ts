declare global {
	namespace NodeJS {
		interface ProcessEnv {
			GOOGLE_API_KEY: string
			MONGODB_URI: string
			GITHUB_ID: string
			GITHUB_SECRET: string
		}
	}
}

export {}
