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
	'core/column',
];

/**
 * Add attribute to settings.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addSettingsAttributes = ( settings, name ) => {
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
			borderStyle: {
				type: 'string',
				default: undefined,
			},
			borderWidth: {
				type: 'number',
				default: undefined,
			},
			borderColor: {
				type: 'string',
				default: undefined,
			},
			borderRadius: {
				type: 'number',
				default: undefined,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/border/add-settings-attributes',
	addSettingsAttributes
);

const MIN_BORDER_WIDTH_VALUE = 0;
const MAX_BORDER_WIDTH_VALUE = 10;
const INITIAL_BORDER_WIDTH_POSITION = 1;
const MIN_BORDER_RADIUS_VALUE = 0;
const MAX_BORDER_RADIUS_VALUE = 100;
const INITIAL_BORDER_RADIUS_POSITION = 0;

function BorderPanel( {
	borderWidth = '',
	borderStyle = '',
	borderColor = '',
	borderRadius = '',
	setAttributes,
} ) {

	const setBorderStyle = useCallback(
		( newBorderStyle ) => {
			setAttributes( { borderStyle: newBorderStyle } );

			if ( ! newBorderStyle ) {
				setAttributes( { borderColor: undefined } );
				setAttributes( { borderWidth: undefined } );
			}
		},
		[ setAttributes ]
	);

	const setBorderWidth = useCallback(
		( newBorderWidth ) => {
			setAttributes( { borderWidth: newBorderWidth ? newBorderWidth : 0 } );
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
			setAttributes( { borderRadius: newBorderRadius ? newBorderRadius : 0 } );
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
			{ !! borderStyle && (
				<RangeControl
					value={ borderWidth }
					label={ __( 'Border width', 'editor-bridge' ) }
					min={ MIN_BORDER_WIDTH_VALUE }
					max={ MAX_BORDER_WIDTH_VALUE }
					initialPosition={ INITIAL_BORDER_WIDTH_POSITION }
					allowReset
					onChange={ setBorderWidth }
				/>
			) }
			{ !! borderStyle && (
				<ColorPaletteControl
					label={ __( 'Color', 'editor-bridge' ) }
					value={ borderColor }
					onChange={ setBorderColor }
				/>
			) }
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
const addBlockEditorControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {

		const {
			name,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! isSelected ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		if ( ! hasBlockSupport( name, 'editorBridgeBorder' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			borderStyle,
			borderWidth,
			borderColor,
			borderRadius,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<BorderPanel
						borderStyle={ borderStyle }
						borderWidth={ borderWidth }
						borderColor={ borderColor }
						borderRadius={ borderRadius }
						setAttributes={ setAttributes }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/border/add-blockeditor-control',
	addBlockEditorControl
);

const addBlockListBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			className,
			attributes,
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeBorder' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			borderStyle,
			borderWidth,
			borderColor,
			borderRadius,
		} = attributes;

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		const style = {
			borderStyle: borderStyle
				? borderStyle
				: undefined,
			borderWidth: borderWidth && borderStyle
				? `${ borderWidth }px`
				: undefined,
			borderColor: borderColor && borderStyle
				? borderColor
				: undefined,
			borderRadius: borderRadius
				? `${ borderRadius }px`
				: undefined,
		}

		wrapperProps = {
			...wrapperProps,
			...customData,
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
				...style,
			},
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'addBlockListBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/border/add-blocklistblock-attributes',
	addBlockListBlockAttributes
);

/**
 * Add attribute to save content.
 *
 * @param {object} props Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addPropsSaveContent = ( props, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeBorder' ) ) {
		return props;
	}

	const {
		borderStyle,
		borderWidth,
		borderColor,
		borderRadius,
	} = attributes;

	const style = {
		borderStyle: borderStyle
			? borderStyle
			: undefined,
		borderWidth: borderWidth != null && borderStyle
			? `${ borderWidth }px`
			: undefined,
		borderColor: borderColor != null && borderStyle
			? borderColor
			: undefined,
		borderRadius: borderRadius != null
			? `${ borderRadius }px`
			: undefined,
	}

	props.style = {
		...props.style,
		...style
	}

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/border/add-props-save-content',
	addPropsSaveContent
);
