'use strict';

/**
 * External dependencies
 */
import { get } from 'lodash';
import hexToRgba from 'hex-to-rgba';
import rgb2hex from 'rgb2hex';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useMemo,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	withSpokenMessages,
	SelectControl,
} from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';
import {
	ColorPaletteControl,
	URLPopover,
	getColorObjectByColorValue,
	getColorObjectByAttributeValues,
} from '@wordpress/block-editor';

const HighlightPopoverAtLink = ( { addingColor, ...props } ) => {
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

		if ( addingColor ) {
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

export function getActiveColorHex( formatName, formatValue, colors ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return null;
	}

	const currentStyle = activeFormat.attributes.style;
	const currentClass = activeFormat.attributes.class;

	if ( currentStyle ) {
		if ( currentClass === 'is-highlight-style-highlight' ) {
			const colorRbg = currentStyle.replace( new RegExp( `^background: linear-gradient\\(transparent 70%, (.*?) 30%\\);` ), '$1' );
			const colorHex = rgb2hex( colorRbg ).hex;
			return colorHex;
		}
		else {
			let regex;
			if ( currentClass === 'is-highlight-style-marker' ) {
				regex = /^background-color:\s(.*?);/
			}
			else if ( currentClass === 'is-highlight-style-underline' ) {
				regex = /border-bottom:\ssolid\s2px\s(.*?);/
			}

			const color = currentStyle.match( regex );

			if (color === null) {
				return null;
			}
			return color[1] ? color[1] : null;
		}
	}

	// Probably not use.
	if ( currentClass ) {
		const colorSlug = currentClass.replace( /.*has-(.*?)-color.*/, '$1' );
		return getColorObjectByAttributeValues( colors, colorSlug ).color;
	}
}

const ColorPicker = ( { label, name, value, onChange } ) => {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return get( getSettings(), [ 'colors' ], [] );
	} );

	const onColorChange = useCallback(
		( color ) => {
			if ( color ) {
				const styleSlug = getActiveStyleSlug( name, value );
				const colorObject = getColorObjectByColorValue( colors, color );
				const style = setStyle( styleSlug, colorObject ? colorObject.color : color );

				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							class: styleSlug ? 'is-highlight-style-' + styleSlug : 'is-highlight-style-highlight',
							style: style ? style : '',
						}
					} )
				);
			} else {
				onChange( removeFormat( value, name ) );
			}
		},
		[ colors, onChange ]
	);


	const activeColor = useMemo( () => getActiveColorHex( name, value, colors ), [
		name,
		value,
		colors,
	] );

	return <ColorPaletteControl
		label={ label }
		value={ activeColor }
		onChange={ onColorChange }
	/>;
};

export function getActiveStyleSlug( formatName, formatValue ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return null;
	}

	const currentClass = activeFormat.attributes.class;
	if ( currentClass ) {
		const styleSlug = currentClass.replace( /^is\-highlight\-style\-(.*)$/, '$1' );
		return styleSlug;
	}

	return null;
}

const StylePicker = ( { label, name, value, onChange } ) => {
	const onStyleChange = useCallback(
		( styleSlug ) => {
			const color = getActiveColorHex( name, value );
			const style = setStyle( styleSlug, color );

			if ( styleSlug ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							class: styleSlug ? 'is-highlight-style-' + styleSlug : 'is-highlight-style-highlight',
							style: style ? style : '',
						}
					} )
				);
			}
		},
		[ onChange ]
	);

	const activeStyle = useMemo( () => getActiveStyleSlug( name, value ), [
		name,
		value,
	] );

	return <SelectControl
		label={ label }
		value={ activeStyle ? activeStyle : 'highlight' }
		options={ [
			{ label: __( 'Highlight', 'guten-bridge' ), value: 'highlight' },
			{ label: __( 'Marker', 'guten-bridge' ), value: 'marker' },
			{ label: __( 'Underline', 'guten-bridge' ), value: 'underline' },
		] }
		onChange={ onStyleChange }
	/>;
};

export function setStyle( styleSlug, color ) {
	if ( ! color ) {
		return;
	}
	if ( ! styleSlug ) {
		styleSlug = 'highlight';
	}

	if ( styleSlug === 'highlight' ) {
		return `background: linear-gradient(transparent 70%, ${ hexToRgba( color, 0.6 ) } 30%);`;
	}
	else if ( styleSlug === 'marker' ) {
		return `background-color: ${ color };`;
	}
	else if ( styleSlug === 'underline' ) {
		return `border-bottom: solid 2px ${ color };`;
	}

	return;
}

const InlineHighlightUI = ( {
	name,
	value,
	onChange,
	onClose,
	isActive,
	addingColor,
} ) => {
	return (
		<HighlightPopoverAtLink
			value={ value }
			isActive={ isActive }
			addingColor={ addingColor }
			onClose={ onClose }
			className="components-inline-highligh-popover is-flex-dir-column"
		>
			<ColorPicker
				label={ __( 'Color', 'guten-bridge' ) }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
			<StylePicker
				label={ __( 'Style', 'guten-bridge' ) }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
		</HighlightPopoverAtLink>
	);
};

export default withSpokenMessages( InlineHighlightUI );
