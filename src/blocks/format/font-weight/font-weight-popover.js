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

export function getActiveFontWeight( formatName, formatValue ) {
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
			{ label: __( 'Default', 'guten-bridge' ), value: '' },
			{ label: __( 'Bold', 'guten-bridge' ), value: 'bold' },
			{ label: __( 'Normal', 'guten-bridge' ), value: 'normal' },
			{ label: __( 'Initial', 'guten-bridge' ), value: 'initial' },
			{ label: __( 'Bolder', 'guten-bridge' ), value: 'bolder' },
			{ label: __( 'Lighter', 'guten-bridge' ), value: 'lighter' },
			{ label: __( '100', 'guten-bridge' ), value: '100' },
			{ label: __( '200', 'guten-bridge' ), value: '200' },
			{ label: __( '300', 'guten-bridge' ), value: '300' },
			{ label: __( '400', 'guten-bridge' ), value: '400' },
			{ label: __( '500', 'guten-bridge' ), value: '500' },
			{ label: __( '600', 'guten-bridge' ), value: '600' },
			{ label: __( '700', 'guten-bridge' ), value: '700' },
			{ label: __( '800', 'guten-bridge' ), value: '800' },
			{ label: __( '900', 'guten-bridge' ), value: '900' },
			{ label: __( 'Revert', 'guten-bridge' ), value: 'revert' },
			{ label: __( 'Unset', 'guten-bridge' ), value: 'unset' },
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
				label={ __( 'Font Weight', 'guten-bridge' ) }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
			<ResetButton
				label={ __( 'Reset', 'guten-bridge' ) }
				name={ name }
				value={ value }
				onChange={ onChange }
			/>
		</FontWeightPopoverAtLink>
	);
};

export default withSpokenMessages( InlineFontWeightUI );
