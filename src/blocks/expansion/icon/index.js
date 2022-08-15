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
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import IconSelectControl from '../../../helper/icon-select-control/index.js';
import { IconSettings } from './icon-settings.js';

const enableBlocks = [
	'core/list',
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
			editorBridgeIcon: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeIcon' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.iconUnicode ) {
		settings.attributes = assign( settings.attributes, {
			iconUnicode: {
				type: 'string',
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/icon/add-settings-attributes',
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

		if ( ! hasBlockSupport( name, 'editorBridgeIcon' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			className,
			iconUnicode,
		} = attributes;

		if ( ! className ) {
			setAttributes( { iconUnicode: undefined } );

			return (
				<BlockEdit { ...props } />
			);
		}

		const regexp = /is-style-icon/
		if ( ! className.match( regexp ) ) {
			setAttributes( { iconUnicode: undefined } );

			return (
				<BlockEdit { ...props } />
			);
		}

		return (
			<>
				<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __( 'Icon Settings', 'editor-bridge' ) }
							initialOpen={ false }
						>
							<IconSelectControl
								label={ __( 'Icons', 'editor-bridge' ) }
								value={ iconUnicode ? iconUnicode : '0' }
								options={ IconSettings }
								onChange={ ( value ) => {
									setAttributes( {
										iconUnicode: value,
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
	'editor-bridge/expansion/icon/add-blockeditor-control',
	addBlockEditorControl
);

const addBlockListBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			attributes,
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeIcon' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			className,
			iconUnicode,
		} = attributes;

		if ( ! className ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const regexp = /is-style-icon/
		if ( ! className.match( regexp ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		if ( ! iconUnicode ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		const style = {
			'--editor-bridge-icon-unicode': '"\\' + iconUnicode + '"',
		}

		wrapperProps = {
			...wrapperProps,
			...customData,
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
				...style,
			},
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'addBlockListBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/icon/add-blocklistblock-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeIcon' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	if ( ! className ) {
		return props;
	}

	const regexp = /is-style-icon/
	if ( ! className.match( regexp ) ) {
		return props;
	}

	const {
		iconUnicode,
	} = attributes;

	if ( ! iconUnicode ) {
		return props;
	}

	const style = {
		'--editor-bridge-icon-unicode': '"\\' + iconUnicode + '"',
	}

	props.style = {
		...props.style,
		...style
	}

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/icon/add-props-save-content',
	addPropsSaveContent
);
