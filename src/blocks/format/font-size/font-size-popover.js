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
	withSpokenMessages,
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

export function getActiveFontSize( formatName, formatValue ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( currentStyle ) {
		const fontSize = currentStyle.replace( /^font-size:\s([0-9]*)px;$/, '$1' );
		return fontSize;
	}

	return;
}

const InlineFontSizeUI = ( {
	name,
	value,
	onChange,
	onClose,
	isActive,
	addingFontSize,
} ) => {

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

	return (
		<FontSizePopoverAtLink
			value={ value }
			isActive={ isActive }
			addingFontSize={ addingFontSize }
			onClose={ onClose }
			className="components-inline-fontsize-popover"
		>

			<FontSizePicker
				fontSizes={ fontSizes }
				value={ activeFontSize }
				onChange={ onFontSizeChange }
			/>
		</FontSizePopoverAtLink>
	);
};

export default withSpokenMessages( InlineFontSizeUI );
