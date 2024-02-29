'use strict';

/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import {
	useCachedTruthy,
} from '@wordpress/block-editor';
import { Popover, FontSizePicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { fontSize as settings } from './index';

export function getActiveFontSize( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return undefined;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( ! currentStyle ) {
		return undefined;
	}

	const regexp = /^font-size:\s(\d+(?:\.\d+)?(px|em|rem));$/
	const fontSize = currentStyle.match( regexp );

	if ( fontSize === null ) {
		return undefined;
	}
	return fontSize[1] ? fontSize[1] : undefined;
}

export default function InlineFontSizeUI( {
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

	const fontSizes = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().fontSizes
	);

	const activeFontSize = useMemo( () => getActiveFontSize( name, value ), [
		name,
		value,
		fontSizes,
	] );

	const onFontSizeChange = useCallback(
		( fontSize ) => {
			if ( fontSize ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							style: `font-size: ${ fontSize };`,
						}
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ fontSizes, onChange ]
	);

	const pickerClassName = 'components-fontsize-picker';
	const fallbackFontSize = 16;

	return (
		<Popover
			className="components-inline-fontsize-popover"
			anchor={ popoverAnchor }
			onClose={ onClose }
		>

			<fieldset className={ pickerClassName }>
				<FontSizePicker
					fontSizes={ fontSizes }
					value={ activeFontSize }
					fallbackFontSize={ fallbackFontSize }
					onChange={ onFontSizeChange }
					__nextHasNoMarginBottom={ true }
				/>
			</fieldset>
		</Popover>
	);
};
