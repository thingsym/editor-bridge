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
				const classNameSlug = getActiveClassNameSlug( name, value );
				const colorObject = getColorObjectByColorValue( colors, color );
				const style = setStyle( classNameSlug, colorObject ? colorObject.color : color );

				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							class: classNameSlug ? 'is-badge-style-' + classNameSlug : 'is-badge-style-default',
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

export function getActiveClassNameSlug( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return undefined;
	}

	const currentClass = activeFormat.attributes.class;
	if ( ! currentClass ) {
		return undefined;
	}

	const regexp = /^is\-badge\-style\-(.*)$/
	const classNameSlug = currentClass.match( regexp );

	if ( classNameSlug === null ) {
		return undefined;
	}
	return classNameSlug[1] ? classNameSlug[1] : '';
}

const ClassNameSlugPicker = ( { label, name, value, onChange } ) => {
	const onClassNameSlugChange = useCallback(
		( classNameSlug ) => {
			const color = getActiveColorHex( name, value );
			const style = setStyle( classNameSlug, color );

			if ( classNameSlug ) {
				onChange(
					applyFormat( value, {
						type: name,
						attributes: {
							class: classNameSlug ? 'is-badge-style-' + classNameSlug : 'is-badge-style-default',
							style: style ? style : '',
						}
					} )
				);
			}
		},
		[ onChange ]
	);

	const activeClassNameSlug = useMemo( () => getActiveClassNameSlug( name, value ), [
		name,
		value,
	] );

	return <SelectControl
		label={ label }
		value={ activeClassNameSlug ? activeClassNameSlug : 'default' }
		options={ [
			{ label: __( 'Default', 'editor-bridge' ), value: 'default' },
			{ label: __( 'Round Corner', 'editor-bridge' ), value: 'round-corner' },
			{ label: __( 'Round', 'editor-bridge' ), value: 'round' },
			{ label: __( 'Outline', 'editor-bridge' ), value: 'outline' },
			{ label: __( 'Status', 'editor-bridge' ), value: 'status' },
			{ label: __( 'Perfect Circle', 'editor-bridge' ), value: 'perfect-circle' },
		] }
		onChange={ onClassNameSlugChange }
	/>;
};

export function setStyle( classNameSlug = 'default', color = '#cccccc' ) {
	if ( classNameSlug === 'default' ) {
		return `background-color: ${ backgroundColor };padding: .2rem .8em;`;
	}
	else if ( classNameSlug === 'round-corner' ) {
		return `background-color: ${ backgroundColor };padding: .2rem .8em;border-radius: .5rem;`;
	}
	else if ( classNameSlug === 'round' ) {
		return `background-color: ${ backgroundColor };padding: .2rem .8em;border-radius: 2rem;`;
	}
	else if ( classNameSlug === 'outline' ) {
		return `background-color: #fff;border: solid 1px ${ backgroundColor };padding: .2rem .8em;`;
	}
	else if ( classNameSlug === 'status' ) {
		return `background-color: #fff;border: solid 1px ${ backgroundColor };padding: .2rem .8em;border-radius: 2rem;`;
	}
	else if ( classNameSlug === 'perfect-circle' ) {
		return `background-color: ${ backgroundColor };border-radius: 50%;display: inline-block;text-align: center;`;
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
			<ClassNameSlugPicker
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
