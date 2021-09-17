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
const addAttributes = ( settings, name ) => {
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
	'editor-bridge/expansion/width/add-attributes',
	addAttributes
);

/**
 * Create HOC to add control to inspector controls.
 */
const withWidthControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeWidth' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		if ( ! isSelected ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			widthSlug,
			className,
		} = props.attributes;

		function handleChange( newWidthSlug ) {
			const setWidth = widthSlug === newWidthSlug ? undefined : newWidthSlug;
			setAttributes( { widthSlug: setWidth } );
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
}, 'withWidthControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/width/with-control',
	withWidthControl
);

const withWidthBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeWidth' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			widthSlug,
		} = props.attributes;

		const className = classnames();

		let customData = {};
		if ( widthSlug ) {
			customData[ 'data-width-slug' ] = widthSlug;
		}

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'withWidthBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/width/with-block-attributes',
	withWidthBlockAttributes
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
const getSaveWidthContent = ( extraProps, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeWidth' ) ) {
		return extraProps;
	}

	extraProps.className = classnames(
		extraProps.className,
		{
			[ `is-width-${ attributes.widthSlug }` ]: attributes.widthSlug,
		}
	);

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/width/get-save-content',
	getSaveWidthContent
);
