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
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	PanelBody,
	SelectControl
} from '@wordpress/components';

const enableBlocks = [
	'core/heading',
	'core/paragraph',
	'core/image',
	'core/button',
	'core/buttons',
	'core/media-text',

	'core/list',
	'core/table',

	'core/columns',
	'core/column',
	'core/group',
	'core/cover',
];

const spaceSettingsOptions = [
	{
		label: __( 'Not set', 'guten-bridge' ),
		value: '',
	},
	{
		label: __( 'None', 'guten-bridge' ),
		value: 'none',
	},
	{
		label: __( 'Small', 'guten-bridge' ),
		value: 'small',
	},
	{
		label: __( 'Medium', 'guten-bridge' ),
		value: 'medium',
	},
	{
		label: __( 'Large', 'guten-bridge' ),
		value: 'large',
	},
	{
		label: __( 'Huge', 'guten-bridge' ),
		value: 'huge',
	},
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
			gutenBridgeSpace: true,
			gutenBridgeSpaceMargin: true,
			gutenBridgeSpacePadding: true,
		} );

		if ( name == 'core/column' ) {
			settings.supports = assign( settings.supports, {
				gutenBridgeSpaceMargin: false,
			} );
		}

		if ( name == 'core/button' || name == 'core/list' || name == 'core/table' || name == 'core/media-text' ) {
			settings.supports = assign( settings.supports, {
				gutenBridgeSpacePadding: false,
			} );
		}
	}

	if ( ! hasBlockSupport( settings, 'gutenBridgeSpace' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.marginSlug ) {
		settings.attributes = assign( settings.attributes, {
			marginSlug: {
				type: 'string',
				default: spaceSettingsOptions[ 0 ].value,
			},
		} );
	}

	if ( ! settings.attributes.paddingSlug ) {
		settings.attributes = assign( settings.attributes, {
			paddingSlug: {
				type: 'string',
				default: spaceSettingsOptions[ 0 ].value,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'guten-bridge/expansion/space/add-attributes',
	addAttributes
);

/**
 * Create HOC to add control to inspector controls.
 */
const withSpaceControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'gutenBridgeSpace' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			marginSlug,
			paddingSlug,
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
					<PanelBody
						title={ __( 'Space Settings', 'guten-bridge' ) }
						initialOpen={ true }
					>
						{ hasBlockSupport( name, 'gutenBridgeSpaceMargin' ) && (
							<SelectControl
								label={ __( 'Margin', 'guten-bridge' ) }
								value={ marginSlug }
								options={ spaceSettingsOptions }
								onChange={ ( newMarginSlug ) => {
									props.setAttributes( {
										marginSlug: newMarginSlug,
									} );
								} }
							/>
						) }
						{ hasBlockSupport( name, 'gutenBridgeSpacePadding' ) && (
							<SelectControl
								label={ __( 'Padding', 'guten-bridge' ) }
								value={ paddingSlug }
								options={ spaceSettingsOptions }
								onChange={ ( newPaddingSlug ) => {
									props.setAttributes( {
										paddingSlug: newPaddingSlug,
									} );
								} }
							/>
						) }
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSpaceControl' );

addFilter(
	'editor.BlockEdit',
	'guten-bridge/expansion/space/with-control',
	withSpaceControl
);

const withSpaceBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'gutenBridgeSpace' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			marginSlug,
			paddingSlug,
		} = props.attributes;

		const className = classnames();

		let customData = {};

		if ( marginSlug ) {
			customData[ 'data-margin-slug' ] = marginSlug;
		}
		if ( paddingSlug ) {
			customData[ 'data-padding-slug' ] = paddingSlug;
		}

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'withSpaceBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'guten-bridge/expansion/space/with-block-attributes',
	withSpaceBlockAttributes
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
const getSaveSpaceContent = ( extraProps, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'gutenBridgeSpace' ) ) {
		return extraProps;
	}

	extraProps.className = classnames(
		extraProps.className,
		{
			[ `is-margin-${ attributes.marginSlug }` ]: hasBlockSupport( blockType.name, 'gutenBridgeSpaceMargin' ) && attributes.marginSlug,
			[ `is-padding-${ attributes.paddingSlug }` ]: hasBlockSupport( blockType.name, 'gutenBridgeSpacePadding' ) && attributes.paddingSlug,
		}
	);

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'guten-bridge/expansion/space/get-save-content',
	getSaveSpaceContent
);
