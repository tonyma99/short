import { db } from './firebase'
import {
	addDoc,
	arrayUnion,
	collection,
	getDocs,
	query,
	updateDoc,
	where
} from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { ClientDetails } from '@lib/utils/helpers'

export const Links = {
	get: async (id: string) => {
		const linksRef = collection(db, 'links')
		const q = query(linksRef, where('id', '==', id))
		const querySnapshot = await getDocs(q)

		if (!querySnapshot.empty) {
			return querySnapshot.docs[0].data().target
		} else {
			return null
		}
	},
	create: async (url: string, headers?: Headers) => {
		const id = nanoid(8)
		const link = {
			id,
			target: url,
			created: new Date(),
			...(headers && process.env.VERCEL === '1' && { client: new ClientDetails(headers).get() })
		}
		await addDoc(collection(db, 'links'), link)
		return id
	},
	update: async (id: string) => {
		const linksRef = collection(db, 'links')
		const q = query(linksRef, where('id', '==', id))
		const querySnapshot = await getDocs(q)

		if (!querySnapshot.empty) {
			await updateDoc(querySnapshot.docs[0].ref, {
				clicks: arrayUnion({ date: new Date() })
			})
		}
	}
}

export const Blacklist = {
	check: async (url: string) => {
		const hostname = new URL(url).hostname
		const blacklistRef = collection(db, 'blacklist')
		const q = query(blacklistRef, where('hostname', '==', hostname))
		const querySnapshot = await getDocs(q)

		if (!querySnapshot.empty) {
			return true
		} else {
			return false
		}
	},
	add: async (url: string, headers?: Headers) => {
		const hostname = new URL(url).hostname
		await addDoc(collection(db, 'blacklist'), { hostname })
	}
}
