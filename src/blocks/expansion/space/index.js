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
	SelectControl,
	CheckboxControl
} from '@wordpress/components';

const enableBlocks = [
	'core/heading',
	'core/paragraph',
	'core/image',
	'core/button',
	'core/buttons',
	'core/media-text',
	'core/gallery',

	'core/list',
	'core/table',

	'core/columns',
	'core/column',
	'core/group',
	'core/cover',
];

const spaceSettingsOptions = [
	{
		label: __( 'Not set', 'editor-bridge' ),
		value: '',
	},
	{
		label: __( 'None', 'editor-bridge' ),
		value: 'none',
	},
	{
		label: __( 'Small', 'editor-bridge' ),
		value: 'small',
	},
	{
		label: __( 'Medium', 'editor-bridge' ),
		value: 'medium',
	},
	{
		label: __( 'Large', 'editor-bridge' ),
		value: 'large',
	},
	{
		label: __( 'Huge', 'editor-bridge' ),
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
const addSettingsAttributes = ( settings, name ) => {
	if ( enableBlocks.includes( name ) ) {
		if ( ! settings.supports ) {
			settings.supports = {};
		}
		settings.supports = assign( settings.supports, {
			editorBridgeSpace: true,
			editorBridgeSpaceMargin: true,
			editorBridgeSpacePadding: true,
		} );

		if ( name == 'core/column' ) {
			settings.supports = assign( settings.supports, {
				editorBridgeSpaceMargin: false,
			} );
		}

		if ( name == 'core/button'
			|| name == 'core/list'
			|| name == 'core/table'
			|| name == 'core/media-text'
			|| name == 'core/gallery'
		) {
			settings.supports = assign( settings.supports, {
				editorBridgeSpacePadding: false,
			} );
		}
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeSpace' ) ) {
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
		settings.attributes = assign( settings.attributes, {
			disablePaddingHorizontal: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/space/add-settings-attributes',
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

		if ( ! hasBlockSupport( name, 'editorBridgeSpace' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			marginSlug,
			paddingSlug,
			disablePaddingHorizontal,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody
						title={ __( 'Space Settings', 'editor-bridge' ) }
						initialOpen={ false }
					>
						{ hasBlockSupport( name, 'editorBridgeSpaceMargin' ) && (
							<SelectControl
								label={ __( 'Margin', 'editor-bridge' ) }
								value={ marginSlug }
								options={ spaceSettingsOptions }
								onChange={ ( newMarginSlug ) => {
									props.setAttributes( {
										marginSlug: newMarginSlug,
									} );
								} }
							/>
						) }
						{ hasBlockSupport( name, 'editorBridgeSpacePadding' ) && (
							<SelectControl
								label={ __( 'Padding', 'editor-bridge' ) }
								value={ paddingSlug }
								options={ spaceSettingsOptions }
								onChange={ ( newPaddingSlug ) => {
									props.setAttributes( {
										paddingSlug: newPaddingSlug,
									} );
								} }
							/>
						) }
						{ hasBlockSupport( name, 'editorBridgeSpacePadding' ) && !( paddingSlug == '' || paddingSlug == 'none' ) && (
							<CheckboxControl
								label={ __( 'Disable the horizontal setting', 'editor-bridge' ) }
								value={ disablePaddingHorizontal }
								checked={ disablePaddingHorizontal }
								onChange={(value) =>
									setAttributes({ disablePaddingHorizontal: value })
								}
							/>
						) }
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/space/add-blockeditor-control',
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

		if ( ! hasBlockSupport( name, 'editorBridgeSpace' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			marginSlug,
			paddingSlug,
			disablePaddingHorizontal,
		} = attributes;

		const className = classnames();

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		if ( marginSlug ) {
			customData[ 'data-margin-slug' ] = marginSlug;
		}
		if ( paddingSlug ) {
			customData[ 'data-padding-slug' ] = paddingSlug;
		}
		if ( disablePaddingHorizontal && !( paddingSlug == '' || paddingSlug == 'none' ) ) {
			customData[ 'data-disable-padding-horizontal' ] = disablePaddingHorizontal;
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
	'editor-bridge/expansion/space/add-blocklistblock-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeSpace' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	props.className = classnames(
		className,
		{
			[ `is-margin-${ attributes.marginSlug }` ]: hasBlockSupport( blockType.name, 'editorBridgeSpaceMargin' ) && attributes.marginSlug,
			[ `is-padding-${ attributes.paddingSlug }` ]: hasBlockSupport( blockType.name, 'editorBridgeSpacePadding' ) && attributes.paddingSlug,
			[ `disable-padding-horizontal` ]: hasBlockSupport( blockType.name, 'editorBridgeSpacePadding' ) && attributes.paddingSlug && !( attributes.paddingSlug == '' || attributes.paddingSlug == 'none' ) && attributes.disablePaddingHorizontal,
		}
	);

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/space/add-props-save-content',
	addPropsSaveContent
);
