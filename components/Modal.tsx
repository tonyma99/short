import { PropsWithChildren } from 'react'

export default function Modal({ children }: PropsWithChildren) {
	return <div className="bg-gray-100 p-4 rounded-md max-w-[360px]">{children}</div>
}
