import Button from './Button'

export default function TextInput(props: any) {
	const { button, disabled, ...attributes } = props
	return (
		<div className="flex flex-shrink rounded-md shadow-md">
			<input
				className={`bg-white grow p-3 rounded-md outline-none leading-none ${
					button && 'rounded-r-none'
				}`}
				{...attributes}
				disabled={disabled}
			/>
			{button && <Button className="rounded-l-none" text={button} disabled={disabled} />}
		</div>
	)
}
