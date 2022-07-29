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
		label: __( 'Small', 'editor-bridge' ),
		value: 'small',
	},
	{
		label: __( 'Medium (Not set)', 'editor-bridge' ),
		value: '',
	},
	{
		label: __( 'Large', 'editor-bridge' ),
		value: 'large',
	},
];

const buttonWidthSettingsOptions = [
	{
		label: __( 'Not set', 'editor-bridge' ),
		value: '',
	},
	{
		label: __( 'Quarter', 'editor-bridge' ),
		value: 'quarter',
	},
	{
		label: __( 'One Third', 'editor-bridge' ),
		value: 'one-third',
	},
	{
		label: __( 'Half', 'editor-bridge' ),
		value: 'half',
	},
	{
		label: __( 'Three Quarters', 'editor-bridge' ),
		value: 'three-quarters',
	},
	{
		label: __( 'Full', 'editor-bridge' ),
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
const addSettingsAttributes = ( settings, name ) => {
	if ( enableBlocks.includes( name ) ) {
		if ( ! settings.supports ) {
			settings.supports = {};
		}
		settings.supports = assign( settings.supports, {
			editorBridgeButtonSize: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeButtonSize' ) ) {
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
	'editor-bridge/button-size/add-settings-attributes',
	addSettingsAttributes
);

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

		if ( ! hasBlockSupport( name, 'editorBridgeButtonSize' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			buttonSizeSlug,
			buttonWidthSlug,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody
						title={ __( 'Size Settings', 'editor-bridge' ) }
						initialOpen={ false }
					>
						<SelectControl
							label={ __( 'Size', 'editor-bridge' ) }
							value={ buttonSizeSlug }
							options={ buttonSizeSettingsOptions }
							onChange={ ( newButtonSizeSlug ) => {
								props.setAttributes( {
									buttonSizeSlug: newButtonSizeSlug,
								} );
							} }
						/>
						<SelectControl
							label={ __( 'Width', 'editor-bridge' ) }
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
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/button-size/add-blockeditor-control',
	addBlockEditorControl
);

const addBlockListBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeButtonSize' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			buttonSizeSlug,
			buttonWidthSlug,
		} = attributes;

		const className = classnames();

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		if ( buttonSizeSlug ) {
			customData['data-button-size'] = buttonSizeSlug;
		}
		if ( buttonWidthSlug ) {
			customData['data-button-width'] = buttonWidthSlug;
		}

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'addBlockListBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/button-size/add-blocklistblock-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeButtonSize' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	props.className = classnames(
		className,
		{
			[`is-button-size-${ attributes.buttonSizeSlug }`]: attributes.buttonSizeSlug,
			[`is-button-width-${ attributes.buttonWidthSlug }`]: attributes.buttonWidthSlug,
		}
	);

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/button-size/add-props-save-content',
	addPropsSaveContent
);
