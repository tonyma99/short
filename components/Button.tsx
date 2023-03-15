'use client'
import { HTMLAttributes, MouseEventHandler } from 'react'

type Props = {
	className?: string
	text: string
	handler?: Function
}

export default function Button({ className, text, handler }: Props) {
	return (
		<button
			className={`bg-gray-200 p-3 rounded-md hover:bg-gray-300 transition-all font-bold leading-none ${className}`}
			onClick={handler as MouseEventHandler}
		>
			{text}
		</button>
	)
}
