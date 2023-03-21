import { PropsWithChildren } from 'react'

type Props = {
	className?: string
}

export default function Modal({ children, className }: PropsWithChildren<Props>) {
	return <div className={`bg-gray-100 p-4 rounded-md max-w-[360px] ${className}`}>{children}</div>
}
