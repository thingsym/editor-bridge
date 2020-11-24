'use strict';

/**
 * External dependencies
 */
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
	'core/columns',
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
			editorBridgeBorder: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeBorder' ) ) {
		return settings;
	}

	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.editorBridgeBorder ) {
		settings.attributes = assign( settings.attributes, {
			borderWidth: {
				type: 'number',
				default: 0,
			},
			borderStyle: {
				type: 'string',
				default: undefined,
			},
			borderColor: {
				type: 'string',
				default: undefined,
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
	'editor-bridge/expansion/border/add-attributes',
	addAttributes
);

const MIN_BORDER_WIDTH_VALUE = 0;
const MAX_BORDER_WIDTH_VALUE = 10;
const INITIAL_BORDER_WIDTH_POSITION = 0;
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
		<PanelBody
			title={ __( 'Border settings', 'editor-bridge' ) }
			initialOpen={ false }
		>
			<SelectControl
				label={ __( 'Style', 'editor-bridge' ) }
				value={ borderStyle }
				options={ [
					{ label: __( 'None', 'editor-bridge' ), value: '' },
					{ label: __( 'Solid', 'editor-bridge' ), value: 'solid' },
					{ label: __( 'Dashed', 'editor-bridge' ), value: 'dashed' },
					{ label: __( 'Dotted', 'editor-bridge' ), value: 'dotted' },
					{ label: __( 'Double', 'editor-bridge' ), value: 'double' },
				] }
				onChange={ setBorderStyle }
			/>
			<RangeControl
				value={ borderWidth }
				label={ __( 'Border width', 'editor-bridge' ) }
				min={ MIN_BORDER_WIDTH_VALUE }
				max={ MAX_BORDER_WIDTH_VALUE }
				initialPosition={ INITIAL_BORDER_WIDTH_POSITION }
				allowReset
				onChange={ setBorderWidth }
			/>
			<ColorPaletteControl
				label={ __( 'Color', 'editor-bridge' ) }
				value={ borderColor }
				onChange={ setBorderColor }
			/>
			<RangeControl
				value={ borderRadius }
				label={ __( 'Border radius', 'editor-bridge' ) }
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

		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeBorder' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			borderWidth,
			borderStyle,
			borderColor,
			borderRadius,
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
	'editor-bridge/expansion/border/with-control',
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

		if ( ! hasBlockSupport( name, 'editorBridgeBorder' ) ) {
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

		let customData = {};

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		wrapperProps.style = {
			borderWidth: borderWidth && borderStyle
				? borderWidth + 'px'
				: undefined,
			borderStyle: borderStyle
				? borderStyle
				: undefined,
			borderColor: borderColor
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
	'editor-bridge/expansion/border/with-block-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeBorder' ) ) {
		return extraProps;
	}

	const {
		borderWidth,
		borderStyle,
		borderColor,
		borderRadius,
	} = attributes;

	extraProps.style = {
		borderWidth: borderWidth && borderStyle
			? borderWidth + 'px'
			: undefined,
		borderStyle: borderStyle
			? borderStyle
			: undefined,
		borderColor: borderColor
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
	'editor-bridge/expansion/border/get-save-content',
	getSaveBorderContent
);
