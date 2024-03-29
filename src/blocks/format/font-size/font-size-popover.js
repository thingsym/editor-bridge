'use strict';

/**
 * WordPress dependencies
 */
import {
	useCallback,
	useMemo,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	FontSizePicker,
} from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';
import {
	URLPopover,
} from '@wordpress/block-editor';

const FontSizePopoverAtLink = ( { addingFontSize, ...props } ) => {
	// There is no way to open a text formatter popover when another one is mounted.
	// The first popover will always be dismounted when a click outside happens, so we can store the
	// anchor Rect during the lifetime of the component.
	const anchorRect = useMemo( () => {
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingFontSize ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( 'span' );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [] );

	if ( ! anchorRect ) {
		return null;
	}

	return <URLPopover
		anchorRect={ anchorRect }
		{ ...props }
	/>;
};

export function getActiveFontSize( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( ! currentStyle ) {
		return;
	}

	const regexp = /^font-size:\s(\d+(?:\.\d+)?(px|em|rem));$/
	const fontSize = currentStyle.match( regexp );

	if ( fontSize === null ) {
		return;
	}
	return fontSize[1] ? fontSize[1] : '';
}

export default function InlineFontSizeUI( {
	name,
	value,
	onChange,
	onClose,
	isActive,
	addingFontSize,
} ) {

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
					} ),
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ value, onChange ]
	);

	const popoverClassName = 'components-inline-fontsize-popover';
	const pickerClassName = 'components-fontsize-picker';
	const fallbackFontSize = 16;

	return (
		<FontSizePopoverAtLink
			value={ value }
			isActive={ isActive }
			addingFontSize={ addingFontSize }
			onClose={ onClose }
			className={ popoverClassName }
		>

			<fieldset className={ pickerClassName }>
				<FontSizePicker
					fontSizes={ fontSizes }
					value={ activeFontSize }
					fallbackFontSize={ fallbackFontSize }
					onChange={ onFontSizeChange }
				/>
			</fieldset>
		</FontSizePopoverAtLink>
	);
};
