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
	Button,
	ButtonGroup,
} from '@wordpress/components';

const enableBlocks = [
	'core/table',
	'core/columns',
	'core/group',
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
			editorBridgeWidth: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeWidth' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.widthSlug ) {
		settings.attributes = assign( settings.attributes, {
			widthSlug: {
				type: 'string',
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/width/add-settings-attributes',
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

		if ( ! hasBlockSupport( name, 'editorBridgeWidth' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			widthSlug,
			align,
		} = attributes;

		function handleChange( newWidthSlug ) {
			const setWidth = widthSlug === newWidthSlug ? undefined : newWidthSlug;
			setAttributes( { widthSlug: setWidth } );
		}

		if ( align ) {
			setAttributes( { widthSlug: undefined } );

			return (
				<BlockEdit { ...props } />
			);
		}

		return (
			<>
				<BlockEdit { ...props } />
					<InspectorControls>
					<PanelBody title={ __( 'Width settings', 'editor-bridge' ) }>
						<ButtonGroup aria-label={ __( 'Button width', 'editor-bridge' ) }>
							{ [ '25', '50', '75', '100', 'auto', 'unset' ].map( ( widthValue ) => {
								return (
									<Button
										key={ widthValue }
										isSmall
										variant={
											widthValue === widthSlug
												? 'primary'
												: undefined
										}
										onClick={ () => handleChange( widthValue ) }
									>
										{ widthValue }{ ( widthValue != 'auto' && widthValue != 'unset') && ( '%' ) }
									</Button>
								);
							} ) }
						</ButtonGroup>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/width/add-blockeditor-control',
	addBlockEditorControl
);

const addBlockListBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			className,
			attributes,
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeWidth' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			widthSlug,
			align,
		} = attributes;

		const regexp = /full|wide/
		if ( align && align.match( regexp ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const extraClass = classnames(
			className,
			{
				[ `is-width-${ widthSlug }` ]: widthSlug,
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
	'editor-bridge/expansion/width/add-blocklistblock-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeWidth' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	const {
		widthSlug,
		align,
	} = attributes;

	const regexp = /full|wide/
	if ( align && align.match( regexp ) ) {
		return props;
	}

	props.className = classnames(
		className,
		{
			[ `is-width-${ widthSlug }` ]: widthSlug,
		}
	);

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/width/add-props-save-content',
	addPropsSaveContent
);
