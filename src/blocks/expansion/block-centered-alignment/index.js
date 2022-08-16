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
import { BlockControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

const enableBlocks = [
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
			editorBridgeBlockCenteredAlignment: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeBlockCenteredAlignment' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.editorBridgeBlockCenteredAlignment ) {
		settings.attributes = assign( settings.attributes, {
			blockCenteredAlignment: {
				type: 'boolean',
				default: false
			}
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/block-centered-alignment/add-settings-attributes',
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

		if ( ! hasBlockSupport( name, 'editorBridgeBlockCenteredAlignment' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			blockCenteredAlignment,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Change centered alignment', 'editor-bridge' ) }
							icon='plus-alt2'
							isActive={ blockCenteredAlignment }
							onClick={ () => {
								setAttributes( {
									blockCenteredAlignment: ! blockCenteredAlignment,
								} );
							} }
						>
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			</>
		);
	};
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/block-centered-alignment/add-blockeditor-control',
	addBlockEditorControl
);

const addBlockListBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			className,
			attributes,
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeBlockCenteredAlignment' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			blockCenteredAlignment,
		} = attributes;

		const extraClass = classnames(
			className,
			{
				'is-block-centered-alignment': blockCenteredAlignment,
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
	'editor-bridge/expansion/block-centered-alignment/add-blocklistblock-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeBlockCenteredAlignment' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	const {
		blockCenteredAlignment,
	} = attributes;

	props.className = classnames(
		className,
		{
			'is-block-centered-alignment': blockCenteredAlignment,
		}
	);

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/block-centered-alignment/add-props-save-content',
	addPropsSaveContent
);
