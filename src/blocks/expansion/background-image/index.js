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
	ToolbarGroup,
	ToolbarButton,
	MenuItem,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

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

const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

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
			editorBridgeBackgroundImage: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'editorBridgeBackgroundImage' ) ) {
		return settings;
	}
	if ( typeof settings.attributes === 'undefined' ) {
		return settings;
	}

	if ( ! settings.attributes.backgroundUrl ) {
		settings.attributes = assign( settings.attributes, {
			backgroundUrl: {
				type: 'string',
			},
			backgroundId: {
				type: 'number',
			},
			backgroundType: {
				type: 'string',
				default: 'image',
			},
			backgroundSize: {
				type: 'string',
				default: '',
			},
			hasParallax: {
				type: 'boolean',
				default: false,
			},
			hasRepete: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'editor-bridge/expansion/background-image/add-settings-attributes',
	addSettingsAttributes,
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
			isSelected,
		} = props;

		if ( ! isSelected ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		if ( ! hasBlockSupport( name, 'editorBridgeBackgroundImage' ) ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			backgroundUrl,
			backgroundId,
			backgroundType,
			backgroundSize,
			hasParallax,
			hasRepete,
		} = attributes;

		const onSelectMedia = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( {
					backgroundUrl: undefined,
					backgroundId: undefined,
				} );
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
				backgroundUrl: media.url,
				backgroundId: media.id,
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

		const accept = 'image/*, video/*';
		const editMediaButtonRef = createRef();
		const POPOVER_PROPS = {
			variant: 'toolbar',
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
									icon="format-image"
									isPressed={ backgroundUrl ? true : false }
									label={ __( 'Edit Background Image', 'editor-bridge' ) }
								>
								</ToolbarButton>
							</ToolbarGroup>
						) }
						renderContent={ ( { onClose } ) => (
							<>
								<NavigableMenu
									className="block-editor-editor-bridge-backgound-image__media-upload-menu"
									label={ __( 'Edit Background Image', 'editor-bridge' ) }
								>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ backgroundId }
										render={ ( { open } ) => (
											<MenuItem
												icon="admin-media"
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
														icon="upload"
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

									{ !! backgroundUrl && (
										<MenuItem
											icon="no"
											onClick={ () => {
												setAttributes( {
													backgroundUrl: undefined,
													backgroundId: undefined,
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
					{ !! backgroundUrl && (
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
}, 'addBlockEditorControl' );

addFilter(
	'editor.BlockEdit',
	'editor-bridge/expansion/background-image/add-blockeditor-control',
	addBlockEditorControl,
);

const addBlockListBlockAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const {
			name,
			className,
			attributes,
		} = props;

		if ( ! hasBlockSupport( name, 'editorBridgeBackgroundImage' ) ) {
			return (
				<BlockListBlock { ...props } />
			);
		}

		const {
			backgroundUrl,
			backgroundId,
			backgroundType,
			backgroundSize,
			hasParallax,
			hasRepete,
		} = attributes;

		const extraClass = classnames(
			className,
			{
				'has-parallax': hasParallax,
				'has-repete': hasRepete,
				'has-no-repete': ! hasRepete,
				'has-background-image': backgroundUrl,
			},
		);

		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
		let customData = {};

		const style = {
			backgroundImage: backgroundUrl ? `url(${ backgroundUrl })` : undefined,
			backgroundSize: backgroundSize ? backgroundSize : undefined,
		};

		wrapperProps = {
			...wrapperProps,
			...customData,
			style: {
				...( wrapperProps && { ...wrapperProps.style } ),
				...style,
			},
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } className={ extraClass } />;
	};
}, 'addBlockListBlockAttributes' );

addFilter(
	'editor.BlockListBlock',
	'editor-bridge/expansion/background-image/add-blocklistblock-attributes',
	addBlockListBlockAttributes,
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
	if ( ! hasBlockSupport( blockType.name, 'editorBridgeBackgroundImage' ) ) {
		return props;
	}

	const {
		className,
	} = props;

	const {
		backgroundType,
		backgroundUrl,
		backgroundSize,
		hasParallax,
		hasRepete,
	} = attributes;

	if ( ! backgroundUrl ) {
		return props;
	}

	const style = {
		backgroundImage: backgroundUrl ? `url(${ backgroundUrl })` : undefined,
		backgroundSize: backgroundSize ? backgroundSize : undefined,
	};

	props.style = {
		...props.style,
		...style,
	};

	props.className = classnames(
		className,
		{
			'has-backgrond-image': backgroundUrl,
			'has-parallax': hasParallax,
			'has-repete': hasRepete,
			'has-no-repete': ! hasRepete,
		},
	);

	if ( ! props.className ) {
		props.className = undefined;
	}

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'editor-bridge/expansion/background-image/add-props-save-content',
	addPropsSaveContent,
);
