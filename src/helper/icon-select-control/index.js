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
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function IconSelectControl( {
	help,
	label,
	valueType,
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

	if ( ! valueType ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __( 'Not found valueType.' ) }
			</Notice>
		);
	}

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
							value={
								valueType === 'class' ? option.class
								: valueType === 'unicode' ? option.unicode
								: option.class
							}
							disabled={ option.disabled }
							onClick={ handleChange }
							className={
								valueType === 'class' && option.class === value ? 'actived'
								: valueType === 'unicode' && option.unicode === value ? 'actived'
								: undefined
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
