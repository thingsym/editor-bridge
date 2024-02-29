'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import {
	useCachedTruthy,
} from '@wordpress/block-editor';
import {
	SelectControl,
	Button,
	Popover,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { fontWeight as settings } from './index';

export function getActiveFontWeight( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return undefined;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( ! currentStyle ) {
		return undefined;
	}

	const regexp = /^font-weight:\s(.*);$/
	const fontWeight = currentStyle.match( regexp );

	if ( fontWeight === null ) {
		return;
	}
	return fontWeight[1] ? fontWeight[1] : undefined;
}

const FontWeightPicker = ( { label, name, value, onChange } ) => {
	const onStyleChange = useCallback(
		( fontWeight ) => {
			const style = setStyle( fontWeight );

			if ( fontWeight ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: style ? style : '',
						}
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ onChange ]
	);

	const activeFontWeight = useMemo( () => getActiveFontWeight( name, value ), [
		name,
		value,
	] );

	return <SelectControl
		label={ label }
		value={ activeFontWeight ? activeFontWeight : '' }
		options={ [
			{ label: __( 'Default', 'editor-bridge' ), value: '' },
			{ label: __( 'Bold', 'editor-bridge' ), value: 'bold' },
			{ label: __( 'Normal', 'editor-bridge' ), value: 'normal' },
			{ label: __( 'Initial', 'editor-bridge' ), value: 'initial' },
			{ label: __( 'Bolder', 'editor-bridge' ), value: 'bolder' },
			{ label: __( 'Lighter', 'editor-bridge' ), value: 'lighter' },
			{ label: __( '100', 'editor-bridge' ), value: '100' },
			{ label: __( '200', 'editor-bridge' ), value: '200' },
			{ label: __( '300', 'editor-bridge' ), value: '300' },
			{ label: __( '400', 'editor-bridge' ), value: '400' },
			{ label: __( '500', 'editor-bridge' ), value: '500' },
			{ label: __( '600', 'editor-bridge' ), value: '600' },
			{ label: __( '700', 'editor-bridge' ), value: '700' },
			{ label: __( '800', 'editor-bridge' ), value: '800' },
			{ label: __( '900', 'editor-bridge' ), value: '900' },
			{ label: __( 'Revert', 'editor-bridge' ), value: 'revert' },
			{ label: __( 'Unset', 'editor-bridge' ), value: 'unset' },
		] }
		onChange={ onStyleChange }
	/>;
};

const ResetButton = ( { label, name, value, onChange } ) => {
	return <div class="components-base-control">
		<Button
			className="components-inline-fontweight__clear"
			isSecondary
			isSmall
			onClick={ () => {
				onChange( removeFormat( value, name ) );
			} }
		>
			{ label }
		</Button>
	</div>;
};

export function setStyle( fontWeight ) {
	if ( ! fontWeight ) {
		return;
	}

	return `font-weight: ${ fontWeight };`;
}

export default function InlineFontWeightUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	/*
	 As you change the text color by typing a HEX value into a field,
	 the return value of document.getSelection jumps to the field you're editing,
	 not the highlighted text. Given that useAnchor uses document.getSelection,
	 it will return null, since it can't find the <mark> element within the HEX input.
	 This caches the last truthy value of the selection anchor reference.
	 */
	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

	const pickerClassName = 'components-fontweight-picker';

	return (
		<Popover
			className="components-inline-fontweight-popover"
			anchor={ popoverAnchor }
			onClose={ onClose }
		>
			<fieldset className={ pickerClassName }>
				<FontWeightPicker
					label={ __( 'Font Weight', 'editor-bridge' ) }
					name={ name }
					value={ value }
					onChange={ onChange }
					className="components-fontweight-picker__controls"
				/>
				<ResetButton
					label={ __( 'Reset', 'editor-bridge' ) }
					name={ name }
					value={ value }
					onChange={ onChange }
				/>
			</fieldset>
		</Popover>
	);
};
