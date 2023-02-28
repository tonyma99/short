declare global {
	namespace NodeJS {
		interface ProcessEnv {
			GOOGLE_API_KEY: string
			MONGODB_URI: string
			MONGODB_DB: string
			MONGODB_LINKS: string
		}
	}
}

export {}
