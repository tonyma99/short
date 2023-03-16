'use client'
import { MouseEventHandler, ReactElement } from 'react'

type Props = {
	className?: string
	text: string
	icon?: ReactElement
	handler?: Function
}

export default function Button({ className, text, icon, handler }: Props) {
	return (
		<button
			className={`bg-gray-200 p-3 inline-flex items-center gap-2 rounded-md hover:bg-gray-300 transition-all font-bold leading-none ${className}`}
			onClick={handler as MouseEventHandler}
		>
			{icon}
			{text}
		</button>
	)
}
