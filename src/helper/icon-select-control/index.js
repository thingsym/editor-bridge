'use strict';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { BaseControl } from '@wordpress/components';

export default function IconSelectControl( {
	help,
	label,
	value,
	multiple = false,
	onChange,
	options = [],
	className,
	hideLabelFromVision,
	...props
} ) {
	const instanceId = useInstanceId( IconSelectControl );
	const id = `inspector-select-control-${ instanceId }`;

	const handleChange = ( event ) => {
		if ( multiple ) {
			const selectedOptions = [ ...event.currentTarget.options ].filter(
				( { selected } ) => selected
			);
			const newValues = selectedOptions.map( ( { value } ) => value );
			onChange( newValues );
			return;
		}

		onChange( event.currentTarget.value );
	};

	return (
		! isEmpty( options ) && (
			<BaseControl
				label={ label }
				value={ value }
				hideLabelFromVision={ hideLabelFromVision }
				id={ id }
				help={ help }
				className={ className }
			>
				<div class="icon-select-panel">
					{ options.map( ( option, index ) => (
						<button
							key={ `${ option.label }-${ index }` }
							value={ option.unicode }
							disabled={ option.disabled }
							onClick={ handleChange }
							className={
								option.unicode === value ? 'actived' : undefined
							}
						>
							<i
								className={ option.class }
								title={ option.label }
							>
							</i>
						</button>
					) ) }
				</div>
			</BaseControl>
		)
	);
}
