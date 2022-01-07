'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useMemo,
} from '@wordpress/element';
import {
	withSpokenMessages,
	SelectControl,
	Button,
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

const FontWeightPopoverAtLink = ( { addingFontWeight, ...props } ) => {
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

		if ( addingFontWeight ) {
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

export function getActiveFontWeight( formatName = '', formatValue = {} ) {
	const activeFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeFormat ) {
		return;
	}

	const currentStyle = activeFormat.attributes.style;
	if ( currentStyle ) {
		const fontWeight = currentStyle.replace( /^font-weight:\s(.*);$/, '$1' );
		return fontWeight;
	}

	return;
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

const InlineFontWeightUI = ( {
	name,
	value,
	onChange,
	onClose,
	isActive,
	addingFontWeight,
} ) => {
	return (
		<FontWeightPopoverAtLink
			value={ value }
			isActive={ isActive }
			addingFontWeight={ addingFontWeight }
			onClose={ onClose }
			className="components-inline-fontweight-popover is-flex-dir-column"
		>

			<FontWeightPicker
				label={ __( 'Font Weight', 'editor-bridge' ) }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
			<ResetButton
				label={ __( 'Reset', 'editor-bridge' ) }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
		</FontWeightPopoverAtLink>
	);
};

export default withSpokenMessages( InlineFontWeightUI );
