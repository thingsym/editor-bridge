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
			editorBridgeSpaceGap: false,
		} );

		if ( name == 'core/column' ) {
			settings.supports = assign( settings.supports, {
				editorBridgeSpaceMargin: false,
			} );
		}

		if ( name == 'core/button'
			|| name == 'core/list'
			|| name == 'core/table'
			|| name == 'core/gallery'
		) {
			settings.supports = assign( settings.supports, {
				editorBridgeSpacePadding: false,
			} );
		}
	}

	// if ( name == 'core/buttons' ) {
	if ( name == 'core/columns' ) {
		settings.supports = assign( settings.supports, {
			editorBridgeSpaceGap: true,
		} );
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

	if ( ! settings.attributes.gapSlug ) {
		settings.attributes = assign( settings.attributes, {
			gapSlug: {
				type: 'string',
				default: spaceSettingsOptions[ 0 ].value,
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
			gapSlug,
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
									setAttributes( {
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
									setAttributes( {
										paddingSlug: newPaddingSlug,
									} );
								} }
							/>
						) }
						{ hasBlockSupport( name, 'editorBridgeSpacePadding' ) && ! ( paddingSlug == '' || paddingSlug == 'none' ) && (
							<CheckboxControl
								label={ __( 'Disable the horizontal setting', 'editor-bridge' ) }
								value={ disablePaddingHorizontal }
								checked={ disablePaddingHorizontal }
								onChange={ ( value ) =>
									setAttributes({ disablePaddingHorizontal: value } )
								}
							/>
						) }
						{ hasBlockSupport( name, 'editorBridgeSpaceGap' ) && (
							<SelectControl
								label={ __( 'Gap', 'editor-bridge' ) }
								value={ gapSlug }
								options={ spaceSettingsOptions }
								onChange={ ( newGapSlug ) => {
									setAttributes( {
										gapSlug: newGapSlug,
									} );
								} }
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
			className,
			attributes,
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
			gapSlug,
		} = attributes;

		const extraClass = classnames(
			className,
			{
				[ `is-margin-${ marginSlug }` ]: hasBlockSupport( name, 'editorBridgeSpaceMargin' ) && marginSlug,
				[ `is-padding-${ paddingSlug }` ]: hasBlockSupport( name, 'editorBridgeSpacePadding' ) && paddingSlug,
				[ `disable-padding-horizontal` ]: hasBlockSupport( name, 'editorBridgeSpacePadding' ) && paddingSlug && ! ( paddingSlug == '' || paddingSlug == 'none' ) && disablePaddingHorizontal,
				[ `is-gap-${ gapSlug }` ]: hasBlockSupport( name, 'editorBridgeSpaceGap' ) && gapSlug,
			}
		);

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } className={ extraClass } />;
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

	const {
		marginSlug,
		paddingSlug,
		disablePaddingHorizontal,
		gapSlug,
	} = attributes;

	props.className = classnames(
		className,
		{
			[ `is-margin-${ marginSlug }` ]: hasBlockSupport( blockType.name, 'editorBridgeSpaceMargin' ) && marginSlug,
			[ `is-padding-${ paddingSlug }` ]: hasBlockSupport( blockType.name, 'editorBridgeSpacePadding' ) && paddingSlug,
			[ `disable-padding-horizontal` ]: hasBlockSupport( blockType.name, 'editorBridgeSpacePadding' ) && paddingSlug && ! ( paddingSlug == '' || paddingSlug == 'none' ) && disablePaddingHorizontal,
			[ `is-gap-${ gapSlug }` ]: hasBlockSupport( blockType.name, 'editorBridgeSpaceGap' ) && gapSlug,
		}
	);

	if ( ! props.className ) {
		props.className = undefined;
	}

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/space/add-props-save-content',
	addPropsSaveContent
);
