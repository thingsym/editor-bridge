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
const addAttributes = ( settings, name ) => {
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

	if ( ! settings.attributes.disableInnerContainerWidth ) {
		settings.attributes = assign( settings.attributes, {
			disableInnerContainerWidth: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/container/add-attributes',
	addAttributes
);

/**
 * Create HOC to add control to inspector controls.
 */
const withContainerControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeContainer' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			disableInnerContainerWidth,
			align,
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
				{ align == 'full' && (
					<InspectorControls>
						<PanelBody
							title={ __( 'Container Settings', 'editor-bridge' ) }
							initialOpen={ false }
						>
							<CheckboxControl
								label={ __( 'Disable inner container width', 'editor-bridge' ) }
								value={ disableInnerContainerWidth }
								checked={ disableInnerContainerWidth }
								onChange={(value) =>
									setAttributes({ disableInnerContainerWidth: value })
								}
							/>
						</PanelBody>
				</InspectorControls>
				) }
			</>
		);
	};
}, 'withContainerControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/container/with-control',
	withContainerControl
);

const withContainerBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			clientId,
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
			disableInnerContainerWidth,
		} = props.attributes;

		const className = classnames();

		let customData = {};
		if ( disableInnerContainerWidth ) {
			customData[ 'data-disable-inner-container-width' ] = disableInnerContainerWidth;
		}

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'withContainerBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/container/with-block-attributes',
	withContainerBlockAttributes
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
const getSaveContainerContent = ( extraProps, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeContainer' ) ) {
		return extraProps;
	}

	extraProps.className = classnames(
		extraProps.className,
		{
			[ `disable-inner-container-width` ]: attributes.align == 'full' ? attributes.disableInnerContainerWidth : false,
		}
	);

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/container/get-save-content',
	getSaveContainerContent
);
