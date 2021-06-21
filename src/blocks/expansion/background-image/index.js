'use strict';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { noop } from 'lodash';
import assign from 'lodash.assign';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { hasBlockSupport } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	FormFileUpload,
	NavigableMenu,
	Dropdown,
	Toolbar,
	ToolbarGroup,
	ToolbarButton,
	MenuItem,
	IconButton,
  PanelBody,
  SelectControl,
	ToggleControl,
} from '@wordpress/components';

import {
	IMAGE_BACKGROUND_TYPE,
	VIDEO_BACKGROUND_TYPE,
	backgroundImageStyles,
} from './shared';

const enableBlocks = [
	'core/heading',
	'core/paragraph',

	'core/column',
	'core/columns',
	'core/group',
];

const backgroundSizeOptions = [
	{
		label: __( 'Orignal', 'editor-bridge' ),
		value: '',
	},
	{
		label: __( 'Fit to Screen', 'editor-bridge' ),
		value: 'contain',
	},
	{
		label: __( 'Fill Screen', 'editor-bridge' ),
		value: 'cover',
	},
];

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

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
			editorBridgeBackgroundImage: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeBackgroundImage' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.url ) {
		settings.attributes = assign( settings.attributes, {
			url: {
				type: 'string',
			},
			id: {
				type: 'number',
			},
			backgroundType: {
				type: 'string',
				default: 'image',
			},
			backgroundSize: {
				type: 'string',
				default: ''
			},
			hasParallax: {
				type: 'boolean',
				default: false
			},
			hasRepete: {
				type: 'boolean',
				default: false
			}
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/background-image/add-attributes',
	addAttributes
);

/**
 * Create HOC to add control to inspector controls.
 */
const withBackgroundImageControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeBackgroundImage' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			url,
			id,
			backgroundType,
			backgroundSize,
			hasParallax,
			hasRepete,
			className,
		} = props.attributes;

		const onSelectMedia = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}
			let mediaType;
			// for media selections originated from a file upload.
			if ( media.media_type ) {
				if ( media.media_type === IMAGE_BACKGROUND_TYPE ) {
					mediaType = IMAGE_BACKGROUND_TYPE;
				} else {
					// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
					// Videos contain the media type of 'file' in the object returned from the rest api.
					mediaType = VIDEO_BACKGROUND_TYPE;
				}
			} else { // for media selections originated from existing files in the media library.
				if (
					media.type !== IMAGE_BACKGROUND_TYPE &&
					media.type !== VIDEO_BACKGROUND_TYPE
				) {
					return;
				}
				mediaType = media.type;
			}

			setAttributes( {
				url: media.url,
				id: media.id,
				backgroundType: mediaType,
			} );
		};

		const onFilesUpload = noop;

		const mediaUpload = useSelect( ( select ) => {
			return select( 'core/block-editor' ).getSettings().mediaUpload;
		}, [] );

		const onError = ( message ) => {};

		const uploadFiles = ( event ) => {
			const files = event.target.files;
			onFilesUpload( files );
			const setMedia = ( [ media ] ) => {
				onSelectMedia( media );
			};
			mediaUpload( {
				allowedTypes: ALLOWED_MEDIA_TYPES,
				filesList: files,
				onFileChange: setMedia,
				onError,
			} );
		};

		const openOnArrowDown = ( event ) => {
			if ( event.keyCode === DOWN ) {
				event.preventDefault();
				event.stopPropagation();
				event.target.click();
			}
		};

		const accept = "image/*, video/*";
		const editMediaButtonRef = createRef();
		const POPOVER_PROPS = {
			isAlternate: true,
		};

		return (
			<>
				<BlockEdit { ...props } />

				<BlockControls>
					<Dropdown
						popoverProps={ POPOVER_PROPS }
						contentClassName="block-editor-editor-bridge-backgound-image__options"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<ToolbarGroup className="editor-bridge-backgound-image">
								<ToolbarButton
									ref={ editMediaButtonRef }
									aria-expanded={ isOpen }
									onClick={ onToggle }
									onKeyDown={ openOnArrowDown }
									icon='format-image'
									isPressed={ url ? true : false }
									label={ __( 'Edit Background Image', 'editor-bridge' ) }
								>
								</ToolbarButton>
							</ToolbarGroup>
						) }
						renderContent={ ( { onClose } ) => (
							<>
								<NavigableMenu className="block-editor-editor-bridge-backgound-image__media-upload-menu">
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ id }
										render={ ( { open } ) => (
											<MenuItem
												icon='admin-media'
												onClick={ open }
											>
												{ __( 'Open Media Library', 'editor-bridge' ) }
											</MenuItem>
										) }
									/>

									<MediaUploadCheck>
										<FormFileUpload
											onChange={ ( event ) => {
												uploadFiles( event, onClose );
											} }
											accept={ accept }
											render={ ( { openFileDialog } ) => {
												return (
													<MenuItem
													icon='upload'
														onClick={ () => {
															openFileDialog();
														} }
													>
														{ __( 'Upload Background Image', 'editor-bridge' ) }
													</MenuItem>
												);
											} }
										/>
									</MediaUploadCheck>

									{ !! url && (
										<MenuItem
											icon='no'
											onClick={ () => {
												setAttributes( {
													url: undefined,
													id: undefined,
													backgroundSize: undefined,
													hasParallax: undefined,
													hasRepete: undefined,
												} );
											} }
										>
											{ __( 'Remove Background Image', 'editor-bridge' ) }
										</MenuItem>
									) }
								</NavigableMenu>
							</>
						) }
					/>
				</BlockControls>

				<InspectorControls>
					{ !! url && (
						<PanelBody
							title={ __( 'Background Image Settings', 'editor-bridge' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Image Size', 'editor-bridge' ) }
								value={ backgroundSize }
								options={ backgroundSizeOptions }
								onChange={ ( newBackgroundSize ) => {
									props.setAttributes( {
										backgroundSize: newBackgroundSize,
									} );
								} }
							/>
							<ToggleControl
								label={ __( 'Fixed Background', 'editor-bridge' ) }
								checked={ hasParallax }
								onChange={ () => {
									setAttributes( {
										hasParallax: ! hasParallax,
									} );
								} }
							/>
							<ToggleControl
								label={ __( 'Repeat Background', 'editor-bridge' ) }
								checked={ hasRepete }
								onChange={ () => {
									setAttributes( {
										hasRepete: ! hasRepete,
									} );
								} }
							/>
						</PanelBody>
					) }
				</InspectorControls>
			</>
		);
	};
}, 'withBackgroundImageControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/background-image/with-control',
	withBackgroundImageControl
);

const withBackgroundImageBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			clientId,
			attributes,
			setAttributes,
			isSelected
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeBackgroundImage' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			url,
			id,
			backgroundType,
			backgroundSize,
			hasParallax,
			hasRepete,
		} = props.attributes;

		const className = classnames(
			{
				'has-parallax': hasParallax,
				'has-repete': hasRepete,
				'has-no-repete': ! hasRepete,
				'has-background-image': url,
			}
		);

		const style = {
			backgroundImage: url ? "url(" + url + ")" : undefined,
			backgroundSize: backgroundSize ? backgroundSize : undefined,
		}

		let customData = {};

		if ( url ) {
			customData[ 'data-background-image' ] = url;
		}
		if ( backgroundSize ) {
			customData[ 'data-background-size' ] = backgroundSize;
		}

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		wrapperProps = {
			...wrapperProps,
			...customData,
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
				...style,
			},
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } className={ className } />;
	};
}, 'withBackgroundImageBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/background-image/with-block-attributes',
	withBackgroundImageBlockAttributes
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
const getSaveBackgroundImageContent = ( extraProps, blockType, attributes ) => {
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeBackgroundImage' ) ) {
		return extraProps;
	}

	const {
		backgroundType,
		url,
		backgroundSize,
		hasParallax,
		hasRepete,
	} = attributes;

	if ( hasBlockSupport( blockType.name, 'editorBridgeBackgroundImage' ) && url ) {
		const style = backgroundType === IMAGE_BACKGROUND_TYPE ?
			backgroundImageStyles( url ) :
			{};

		if ( backgroundSize ) {
			style.backgroundSize = backgroundSize;
		}

		extraProps.style = Object.assign( style, extraProps.style );

		extraProps.className = classnames(
			extraProps.className,
			{
				'has-backgrond-image': url ? true : false,
				'has-parallax': hasParallax,
				'has-repete': hasRepete,
				'has-no-repete': ! hasRepete,
			}
		);
	}

	return extraProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/background-image/get-save-content',
	getSaveBackgroundImageContent
);
