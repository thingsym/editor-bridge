'use strict';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import assign from 'lodash.assign';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { hasBlockSupport } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { useCallback } from '@wordpress/element';
import {
	InspectorControls,
	ColorPaletteControl,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';

import {
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

const enableBlocks = [
	'core/heading',
	'core/paragraph',
	'core/group',
];

/**
 * Add attribute to settings.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addAttributes = ( settings, name ) => {
	if ( enableBlocks.includes( name ) ) {
		if ( ! settings.supports ) {
			settings.supports = {};
		}
		settings.supports = assign( settings.supports, {
			gutenBridgeBorder: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'gutenBridgeBorder' ) ) {
		return settings;
	}

	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.gutenBridgeBorder ) {
		settings.attributes = assign( settings.attributes, {
			borderWidth: {
				type: 'number',
				default: 0,
			},
			borderColor: {
				type: 'string',
				default: '#000000',
			},
			borderStyle: {
				type: 'string',
				default: 'solid',
			},
			borderRadius: {
				type: 'number',
				default: 0,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'guten-bridge/expansion/border/add-attributes',
	addAttributes
);

const MIN_BORDER_WIDTH_VALUE = 0;
const MAX_BORDER_WIDTH_VALUE = 10;
const MIN_BORDER_RADIUS_VALUE = 0;
const MAX_BORDER_RADIUS_VALUE = 50;
const INITIAL_BORDER_RADIUS_POSITION = 5;

function BorderPanel( {
	borderWidth = '',
	borderStyle = '',
	borderColor = '',
	borderRadius = '',
	setAttributes,
 } ) {

	const setBorderWidth = useCallback(
		( newBorderWidth ) => {
			setAttributes( { borderWidth: newBorderWidth } );
		},
		[ setAttributes ]
	);

	const setBorderStyle = useCallback(
		( newBorderStyle ) => {
			setAttributes( { borderStyle: newBorderStyle } );
		},
		[ setAttributes ]
	);

	const setBorderColor = useCallback(
		( newBorderColor ) => {
			setAttributes( { borderColor: newBorderColor } );
		},
		[ setAttributes ]
	);

	const setBorderRadius = useCallback(
		( newBorderRadius ) => {
			setAttributes( { borderRadius: newBorderRadius } );
		},
		[ setAttributes ]
	);

	return (
		<PanelBody title={ __( 'Border settings', 'guten-bridge' ) }>
			<RangeControl
				value={ borderWidth }
				label={ __( 'Width', 'guten-bridge' ) }
				min={ MIN_BORDER_WIDTH_VALUE }
				max={ MAX_BORDER_WIDTH_VALUE }
				onChange={ setBorderWidth }
			/>
			<ColorPaletteControl
				label={ __( 'Color', 'guten-bridge' ) }
				value={ borderColor }
				onChange={ setBorderColor }
			/>
			<SelectControl
				label={ __( 'Style', 'guten-bridge' ) }
				value={ borderStyle }
				options={ [
					{ label: __( 'Solid', 'guten-bridge' ), value: 'solid' },
					{ label: __( 'Dashed', 'guten-bridge' ), value: 'dashed' },
					{ label: __( 'Dotted', 'guten-bridge' ), value: 'dotted' },
					{ label: __( 'Double', 'guten-bridge' ), value: 'double' },
				] }
				onChange={ setBorderStyle }
			/>
			<RangeControl
				value={ borderRadius }
				label={ __( 'Border radius', 'guten-bridge' ) }
				min={ MIN_BORDER_RADIUS_VALUE }
				max={ MAX_BORDER_RADIUS_VALUE }
				initialPosition={ INITIAL_BORDER_RADIUS_POSITION }
				allowReset
				onChange={ setBorderRadius }
			/>
		</PanelBody>
	);
}

/**
 * Create HOC to add control to inspector controls.
 */
const withBorderControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// console.log(props);
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'gutenBridgeBorder' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			borderWidth,
			borderStyle,
			borderColor,
			borderRadius,
			className,
		} = props.attributes;

		if ( ! isSelected ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<BorderPanel
						borderWidth={ borderWidth }
						borderColor={ borderColor }
						borderStyle={ borderStyle }
						borderRadius={ borderRadius }
						setAttributes={ setAttributes }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withBorderControl' );

addFilter(
	'editor.BlockEdit',
	'guten-bridge/expansion/border/with-control',
	withBorderControl
);

const withBorderBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'gutenBridgeBorder' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			borderWidth,
			borderColor,
			borderStyle,
			borderRadius,
		} = props.attributes;

		const className = classnames();

		let customData = {};

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		// console.log(wrapperProps);

		const style =
			borderWidth ? borderWidth + 'px ' : '' + ' '
			+ borderStyle ? borderStyle : '' + ' '
			+ borderColor ? borderColor : '';

		wrapperProps.style = {
			borderWidth: borderWidth
				? borderWidth + 'px'
				: undefined,
			borderStyle: borderStyle && borderWidth
				? borderStyle
				: undefined,
			borderColor: borderColor && borderWidth
				? borderColor
				: undefined,
			borderRadius: borderRadius
				? borderRadius + 'px'
				: undefined,
			...wrapperProps.style,
		}

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'withBorderBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'guten-bridge/expansion/border/with-block-attributes',
	withBorderBlockAttributes
);

/**
 * Add attribute to save content.
 *
 * @param {object} extraProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const getSaveBorderContent = ( extraProps, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'gutenBridgeBorder' ) ) {
		return extraProps;
	}

	// console.log(extraProps.children.props);

	const {
		borderWidth,
		borderStyle,
		borderColor,
		borderRadius,
	} = attributes;

	const style = borderWidth ? borderWidth + 'px' : '' + ' ' + borderStyle ? borderStyle : '' + ' ' + borderColor ? borderColor : '';

	extraProps.style = {
		borderWidth: borderWidth
			? borderWidth + 'px'
			: undefined,
		borderStyle: borderStyle && borderWidth
			? borderStyle
			: undefined,
		borderColor: borderColor && borderWidth
			? borderColor
			: undefined,
		borderRadius: borderRadius
			? borderRadius + 'px'
			: undefined,
		...extraProps.style,
	}

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'guten-bridge/expansion/border/get-save-content',
	getSaveBorderContent
);
