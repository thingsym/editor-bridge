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
	'core/button',
];

const buttonSizeSettingsOptions = [
	{
		label: __( 'Small', 'guten-bridge' ),
		value: 'small',
	},
	{
		label: __( 'Medium (Not set)', 'guten-bridge' ),
		value: '',
	},
	{
		label: __( 'Large', 'guten-bridge' ),
		value: 'large',
	},
];

const buttonWidthSettingsOptions = [
	{
		label: __( 'Not set', 'guten-bridge' ),
		value: '',
	},
	{
		label: __( 'Quarter', 'guten-bridge' ),
		value: 'quarter',
	},
	{
		label: __( 'Half', 'guten-bridge' ),
		value: 'half',
	},
	{
		label: __( 'Full', 'guten-bridge' ),
		value: 'full',
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
			gutenBridgeButtonSize: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'gutenBridgeButtonSize' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.buttonSizeSlug ) {
		settings.attributes = assign( settings.attributes, {
			buttonSizeSlug: {
				type: 'string',
				default: buttonSizeSettingsOptions[ 1 ].value,
			},
		} );
	}

	if ( ! settings.attributes.buttonWidthSlug ) {
		settings.attributes = assign( settings.attributes, {
			buttonWidthSlug: {
				type: 'string',
				default: buttonWidthSettingsOptions[ 0 ].value,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'guten-bridge/button-size/add-attributes',
	addAttributes
);

/**
* Create HOC to add control to inspector controls.
*/
const withButtonSizeControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'gutenBridgeButtonSize' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			buttonSizeSlug,
			buttonWidthSlug,
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
						title={ __( 'Size Settings', 'guten-bridge' ) }
						initialOpen={ true }
					>
						<SelectControl
							label={ __( 'Size', 'guten-bridge' ) }
							value={ buttonSizeSlug }
							options={ buttonSizeSettingsOptions }
							onChange={ ( newButtonSizeSlug ) => {
								props.setAttributes( {
									buttonSizeSlug: newButtonSizeSlug,
								} );
							} }
						/>
						<SelectControl
							label={ __( 'Width', 'guten-bridge' ) }
							value={ buttonWidthSlug }
							options={ buttonWidthSettingsOptions }
							onChange={ ( newButtonWidthSlug ) => {
								props.setAttributes( {
									buttonWidthSlug: newButtonWidthSlug,
								} );
							} }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withButtonSizeControl' );

addFilter(
	'editor.BlockEdit',
	'guten-bridge/button-size/with-control',
	withButtonSizeControl
);

const withButtonSizeBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'gutenBridgeButtonSize' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			buttonSizeSlug,
			buttonWidthSlug,
		} = props.attributes;

		const className = classnames();

		let customData = {};

		if (buttonSizeSlug) {
			customData['data-button-size'] = buttonSizeSlug;
		}
		if (buttonWidthSlug) {
			customData['data-button-width'] = buttonWidthSlug;
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
	'guten-bridge/expansion/button-size/with-block-attributes',
	withButtonSizeBlockAttributes
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
const getSaveButtonSizeContent = ( extraProps, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'gutenBridgeButtonSize' ) ) {
		return extraProps;
	}

	extraProps.className = classnames(
		extraProps.className,
		{
			[`is-button-size-${ attributes.buttonSizeSlug }`]: attributes.buttonSizeSlug,
			[`is-button-width-${ attributes.buttonWidthSlug }`]: attributes.buttonWidthSlug,
		}
	);

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'guten-bridge/button-size/get-save-content',
	getSaveButtonSizeContent
);
