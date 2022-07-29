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
	CheckboxControl
} from '@wordpress/components';

const enableBlocks = [
	'core/group',
	'core/cover',
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
			editorBridgeContainer: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeContainer' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.fixedLayoutWidth ) {
		settings.attributes = assign( settings.attributes, {
			fixedLayoutWidth: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/container/add-settings-attributes',
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

		if ( ! hasBlockSupport( name, 'editorBridgeContainer' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			fixedLayoutWidth,
			align,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				{ align == 'full' && (
					<InspectorControls>
						<PanelBody
							title={ __( 'Container Settings', 'editor-bridge' ) }
							initialOpen={ false }
						>
							<CheckboxControl
								label={ __( 'Fix layout width', 'editor-bridge' ) }
								value={ fixedLayoutWidth }
								checked={ fixedLayoutWidth }
								onChange={(value) =>
									setAttributes({ fixedLayoutWidth: value })
								}
							/>
						</PanelBody>
				</InspectorControls>
				) }
			</>
		);
	};
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/container/add-blockeditor-control',
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

		if ( ! hasBlockSupport( name, 'editorBridgeContainer' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			fixedLayoutWidth,
		} = attributes;

		const className = classnames();

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		if ( fixedLayoutWidth ) {
			customData[ 'data-fixed-layout-width' ] = fixedLayoutWidth;
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
	'editor-bridge/expansion/container/add-blocklistblock-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeContainer' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	props.className = classnames(
		className,
		{
			[ `fixed-layout-width` ]: attributes.align == 'full' ? attributes.fixedLayoutWidth : false,
		}
	);

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/container/add-props-save-content',
	addPropsSaveContent
);
