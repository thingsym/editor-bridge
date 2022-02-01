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
	Popover,
	TabPanel,
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

export function getActiveColorHex( formatName = '', formatValue = {}, colors = [] ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return undefined;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( ! currentStyle ) {
		return undefined;
	}

	const currentClass = activeFormat.attributes.class;

	if ( currentClass === 'is-highlight-style-highlight' ) {
		const regexp = /^background: linear-gradient\(transparent 70%, (.*?) 30%\);/;
		const colorRbg = currentStyle.match( regexp );
		if ( colorRbg === null ) {
			return undefined;
		}

		const colorHex = rgb2hex( colorRbg[1] ).hex;
		return colorHex;
	}
	else {
		let regexp;
		if ( currentClass === 'is-highlight-style-marker' ) {
			regexp = /^background-color:\s(.*?);/
		}
		else if ( currentClass === 'is-highlight-style-underline' ) {
			regexp = /border-bottom:\ssolid\s2px\s(.*?);/
		}
		else if ( currentClass === 'is-highlight-style-dot' ) {
			regexp = /text-emphasis-color:\s(.*?);/
		}

		const color = currentStyle.match( regexp );
		if ( color === null ) {
			return undefined;
		}
		return color[1] ? color[1] : undefined;
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

export function getActiveStyleSlug( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return undefined;
	}

	const currentClass = activeFormat.attributes.class;
	if ( ! currentClass ) {
		return undefined;
	}

	const regexp = /^is\-highlight\-style\-(.*)$/
	const styleSlug = currentClass.match( regexp );

	if ( styleSlug === null ) {
		return undefined;
	}
	return styleSlug[1] ? styleSlug[1] : '';
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
			{ label: __( 'Highlight', 'editor-bridge' ), value: 'highlight' },
			{ label: __( 'Marker', 'editor-bridge' ), value: 'marker' },
			{ label: __( 'Underline', 'editor-bridge' ), value: 'underline' },
			{ label: __( 'Dot', 'editor-bridge' ), value: 'dot' },
		] }
		onChange={ onStyleChange }
	/>;
};

export function setStyle( styleSlug = 'highlight', color = '#cccccc' ) {
	if ( styleSlug === 'highlight' ) {
		return `background: linear-gradient(transparent 70%, ${ hexToRgba( color, 0.6 ) } 30%);`;
	}
	else if ( styleSlug === 'marker' ) {
		return `background-color: ${ color };`;
	}
	else if ( styleSlug === 'underline' ) {
		return `border-bottom: solid 2px ${ color };`;
	}
	else if ( styleSlug === 'dot' ) {
		return `text-emphasis-style: filled circle;-webkit-text-emphasis-style: filled circle;text-emphasis-color: ${ color };-webkit-text-emphasis-color: ${ color };`;
	}

	return;
}

const TabPanelBody = ( { tab, name, value, onChange } ) => {
	if ( tab.name === 'color' ) {
		return <ColorPicker
			property={ tab.name }
			name={ name }
			value={ value }
			onChange={ onChange }
		/>
	}
	else if ( tab.name === 'style' ) {
		return (
			<StylePicker
				property={ tab.name }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
		)
	}
	return
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
			className="components-inline-highligh-popover"
		>
			<TabPanel
				tabs={ [
					{
						name: 'color',
						title: __( 'Color', 'editor-bridge' ),
					},
					{
						name: 'style',
						title: __( 'Style', 'editor-bridge' ),
					},
				] }
			>
				{ ( tab ) => (
					<TabPanelBody
						tab={ tab }
						name={ name }
						value={ value }
						onChange={ onChange }
					/>
				) }
			</TabPanel>
		</HighlightPopoverAtLink>
	);
};

export default withSpokenMessages( InlineHighlightUI );
