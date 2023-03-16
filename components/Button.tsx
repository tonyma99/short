'use client'
import { MouseEventHandler, ReactElement } from 'react'

type Props = {
	className?: string
	text: string
	icon?: ReactElement
	handler?: Function
	disabled?: boolean
}

export default function Button({ className, text, icon, handler, disabled }: Props) {
	return (
		<button
			className={`bg-gray-200 p-3 inline-flex items-center gap-2 rounded-md hover:bg-gray-300 transition-colors font-bold leading-none disabled:opacity-50 disabled:pointer-events-none ${className}`}
			onClick={handler as MouseEventHandler}
			disabled={disabled}
		>
			{icon}
			{text}
		</button>
	)
}
