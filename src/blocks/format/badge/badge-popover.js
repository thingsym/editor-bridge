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
	Button,
} from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
	useAnchorRef,
} from '@wordpress/rich-text';
import {
	ColorPaletteControl,
	URLPopover,
	getColorClassName,
	getColorObjectByColorValue,
	getColorObjectByAttributeValues,
	store as blockEditorStore,
	useCachedTruthy,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
 import { badge as settings, transparentValue } from './index';

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

export function getActiveColorHex( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return undefined;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( ! currentStyle ) {
		return undefined;
	}

	const regexp = /color:(.*?);/

	const color = currentStyle.match( regexp );
	if ( color === null ) {
		return undefined;
	}
	return color[1] ? color[1] : undefined;
}

export function getActiveBackgroundColorHex( formatName = '', formatValue = {} ) {
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
		regexp = /border:solid\s1px\s(.*?);/
	}
	else if ( currentClass === 'is-badge-style-outline' ) {
		regexp = /border:solid\s1px\s(.*?);/
	}
	else {
		regexp = /background-color:(.*?);/
	}

	const backgroundColor = currentStyle.match( regexp );
	if ( backgroundColor === null ) {
		return undefined;
	}
	return backgroundColor[1] ? backgroundColor[1] : undefined;
}

const ColorPicker = ( { label, property, name, value, onChange } ) => {
	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return get( getSettings(), [ 'colors' ], [] );
	} );

	const onColorChange = useCallback(
		( color ) => {
			const classNameSlug = getActiveClassNameSlug( name, value );
			const colorObject = getColorObjectByColorValue( colors, color );

			let style;
			if ( property === 'color' ) {
				const activeBackgroundColor = getActiveBackgroundColorHex( name, value );
				style = setStyle( classNameSlug, color, activeBackgroundColor );
			}
			else if ( property === 'backgroundColor' ) {
				const activeColor = getActiveColorHex( name, value );
				style = setStyle( classNameSlug, activeColor, colorObject ? colorObject.color : color );
			}

			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						class: classNameSlug ? 'is-badge-style-' + classNameSlug : 'is-badge-style-default',
						style: style ? style : '',
					}
				} )
			);
		},
		[ colors, onChange, property ]
	);

	const activeColor = useMemo(
		() => getActiveColorHex( name, value ),
		[ name, value, property, colors, ]
	);

	const activeBackgroundColor = useMemo(
		() => getActiveBackgroundColorHex( name, value ),
		[ name, value, property, colors, ]
	);

	return <ColorPaletteControl
		label={ label }
		value={
			  property === 'color' ? activeColor
			: property === 'backgroundColor' ? activeBackgroundColor
			: ''
		}
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

const ClassNameSlugPicker = ( { label, property, name, value, onChange } ) => {

	const onClassNameSlugChange = useCallback(
		( classNameSlug ) => {
			const backgroundColor = getActiveBackgroundColorHex( name, value );
			const color = getActiveColorHex( name, value );
			const style = setStyle( classNameSlug, color, backgroundColor );

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

	const activeClassNameSlug = useMemo(
		() => getActiveClassNameSlug( name, value ),
		[ name, value, ]
	);

	return <div>
		<SelectControl
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
		/>

		<ResetButton
			label={ __( 'Reset', 'editor-bridge' ) }
			name={ name }
			value={ value }
			onChange={ onChange }
		/>
	</div>;
};

const ResetButton = ( { label, name, value, onChange } ) => {
	return <Button
			className="components-inline-badge-popover__clear"
			isSecondary
			isSmall
			onClick={ () => {
				onChange( removeFormat( value, name ) );
			} }
		>
			{ label }
	</Button>;
};

export function setStyle( classNameSlug = 'default', color = '', backgroundColor = '' ) {
	const styles = [];

	if ( color ) styles.push( [ 'color', color ].join( ':' ) );

	if ( backgroundColor ) {
		if ( classNameSlug === 'default' ) {
			styles.push( [ 'background-color', backgroundColor ].join( ':' ) );
			styles.push( [ 'padding', '.2rem .8em' ].join( ':' ) );
		}
		else if ( classNameSlug === 'round-corner' ) {
			styles.push( [ 'background-color', backgroundColor ].join( ':' ) );
			styles.push( [ 'padding', '.2rem .8em' ].join( ':' ) );
			styles.push( [ 'border-radius', '.5rem' ].join( ':' ) );
		}
		else if ( classNameSlug === 'round' ) {
			styles.push( [ 'background-color', backgroundColor ].join( ':' ) );
			styles.push( [ 'padding', '.2rem .8em' ].join( ':' ) );
			styles.push( [ 'border-radius', '2rem' ].join( ':' ) );
		}
		else if ( classNameSlug === 'outline' ) {
			styles.push( [ 'background-color', '#fff' ].join( ':' ) );
			styles.push( [ 'border', `solid 1px ${ backgroundColor }` ].join( ':' ) );
			styles.push( [ 'padding', '.2rem .8em' ].join( ':' ) );
		}
		else if ( classNameSlug === 'status' ) {
			styles.push( [ 'background-color', '#fff' ].join( ':' ) );
			styles.push( [ 'border', `solid 1px ${ backgroundColor }` ].join( ':' ) );
			styles.push( [ 'padding', '.2rem .8em' ].join( ':' ) );
			styles.push( [ 'border-radius', '2rem' ].join( ':' ) );
		}
		else if ( classNameSlug === 'perfect-circle' ) {
			styles.push( [ 'background-color', backgroundColor ].join( ':' ) );
			styles.push( [ 'border-radius', '50%' ].join( ':' ) );
			styles.push( [ 'display', 'inline-block' ].join( ':' ) );
			styles.push( [ 'text-align', 'center' ].join( ':' ) );
		}
	}

	if ( styles.length ) return styles.join( ';' ) + ';';
	return '';
}

const TabPanelBody = ( { tab, name, value, onChange } ) => {
	if ( tab.name === 'color' || tab.name === 'backgroundColor' ) {
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

	return null;
}

export default function InlineBadgeUI( {
	name,
	value,
	onChange,
	onClose,
	contentRef,
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
						name: 'backgroundColor',
						title: __( 'Background', 'editor-bridge' ),
					},
					{
						name: 'color',
						title: __( 'Text', 'editor-bridge' ),
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
