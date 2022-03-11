'use strict';

/**
 * External dependencies
 */
import { get } from 'lodash';

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

const BadgePopoverAtLink = ( { addingColor, ...props } ) => {
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

	let regexp;
	if ( currentClass === 'is-badge-style-status' ) {
		regexp = /border:\ssolid\s1px\s(.*?);/
	}
	else if ( currentClass === 'is-badge-style-outline' ) {
		regexp = /border:\ssolid\s1px\s(.*?);/
	}
	else {
		regexp = /background-color:\s(.*?);/
	}

	const color = currentStyle.match( regexp );
	if ( color === null ) {
		return undefined;
	}
	return color[1] ? color[1] : undefined;
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
							class: styleSlug ? 'is-badge-style-' + styleSlug : 'is-badge-style-default',
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

	const regexp = /^is\-badge\-style\-(.*)$/
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
							class: styleSlug ? 'is-badge-style-' + styleSlug : 'is-badge-style-default',
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
		value={ activeStyle ? activeStyle : 'default' }
		options={ [
			{ label: __( 'Default', 'editor-bridge' ), value: 'default' },
			{ label: __( 'Round Corner', 'editor-bridge' ), value: 'round-corner' },
			{ label: __( 'Round', 'editor-bridge' ), value: 'round' },
			{ label: __( 'Outline', 'editor-bridge' ), value: 'outline' },
			{ label: __( 'Status', 'editor-bridge' ), value: 'status' },
			{ label: __( 'Perfect Circle', 'editor-bridge' ), value: 'perfect-circle' },
		] }
		onChange={ onStyleChange }
	/>;
};

export function setStyle( styleSlug = 'default', color = '#cccccc' ) {
	if ( styleSlug === 'default' ) {
		return `background-color: ${ color };padding: .2rem .8em;`;
	}
	else if ( styleSlug === 'round-corner' ) {
		return `background-color: ${ color };padding: .2rem .8em;border-radius: .5rem;`;
	}
	else if ( styleSlug === 'round' ) {
		return `background-color: ${ color };padding: .2rem .8em;border-radius: 2rem;`;
	}
	else if ( styleSlug === 'outline' ) {
		return `background-color: #fff;border: solid 1px ${ color };padding: .2rem .8em;`;
	}
	else if ( styleSlug === 'status' ) {
		return `background-color: #fff;border: solid 1px ${ color };padding: .2rem .8em;border-radius: 2rem;`;
	}
	else if ( styleSlug === 'perfect-circle' ) {
		return `background-color: ${ color };border-radius: 50%;display: inline-block;text-align: center;`;
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

export default function InlineBadgeUI( {
	name,
	value,
	onChange,
	onClose,
	isActive,
	addingColor,
} ) {
	return (
		<BadgePopoverAtLink
			value={ value }
			isActive={ isActive }
			addingColor={ addingColor }
			onClose={ onClose }
			className="components-inline-badge-popover"
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
		</BadgePopoverAtLink>
	);
};
