import classnames from 'classnames/dedupe';
import assign from 'lodash.assign';

const { __ } = wp.i18n;
const { hasBlockSupport } = wp.blocks;
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const {
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const {
	Toolbar,
	IconButton,
  PanelBody,
  SelectControl,
	ToggleControl,
} = wp.components;

import {
	IMAGE_BACKGROUND_TYPE,
	VIDEO_BACKGROUND_TYPE,
	backgroundImageStyles,
} from './shared';

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

const enableBackgroundImageBlocks = [
	'core/group',
];

const backgroundSizeOptions = [
	{
		label: __( 'Orignal', 'guten-bridge' ),
		value: '',
	},
	{
		label: __( 'Fit to Screen', 'guten-bridge' ),
		value: 'contain',
	},
	{
		label: __( 'Fill Screen', 'guten-bridge' ),
		value: 'cover',
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
const addAttributes = ( settings, name ) => {
	if ( enableBackgroundImageBlocks.includes( settings.name ) ) {
		if ( ! settings.supports ) {
			settings.supports = {};
		}
		settings.supports = assign( settings.supports, {
			BackgroundImage: true,
		} );
	}

	if ( ! hasBlockSupport( settings, 'BackgroundImage' ) ) {
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
	'guten-bridge/extend/background-image/add-attributes',
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

		if ( ! hasBlockSupport( name, 'BackgroundImage' ) ) {
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

		const style = {
			backgroundImage: "url(" + url + ")",
			backgroundSize: backgroundSize,
		}

		const pClassName = classnames(
			{
				'has-parallax': hasParallax,
				'has-repete': hasRepete,
				'has-no-repete': ! hasRepete,
				'has-background-image': url,
			}
		);

		return (
			<Fragment>
				{ ! url && (
					<BlockEdit { ...props } />
				) }
				{ url && (
					<div style={ style } className={ pClassName }>
					<BlockEdit { ...props } />
					</div>
				) }

				<BlockControls>
					<MediaUploadCheck>
						<Toolbar>
							<MediaUpload
								onSelect={ onSelectMedia }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								value={ id }
								render={ ( { open } ) => (
									<IconButton
										className="components-toolbar__control"
										label={ __( 'Edit Background Image', 'guten-bridge' ) }
										icon='format-image'
										onClick={ open }
									/>
								) }
							/>
						</Toolbar>
						{ !! url && (
							<Toolbar>
								<IconButton
									className="components-button components-icon-button components-toolbar__control"
									label={ __( 'Remove Background Image', 'guten-bridge' ) }
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
								/>
							</Toolbar>
						) }
					</MediaUploadCheck>
				</BlockControls>

				<InspectorControls>
					{ !! url && (
						<PanelBody
							title={ __( 'Background Image Settings', 'guten-bridge' ) }
							initialOpen={ true }
						>
						<SelectControl
							label={ __( 'Image Size', 'guten-bridge' ) }
							value={ backgroundSize }
							options={ backgroundSizeOptions }
							onChange={ ( newBackgroundSize ) => {
								props.setAttributes( {
									backgroundSize: newBackgroundSize,
								} );
							} }
						/>
						<ToggleControl
							label={ __( 'Fixed Background', 'guten-bridge' ) }
							checked={ hasParallax }
							onChange={ () => {
								setAttributes( {
									hasParallax: ! hasParallax,
								} );
							} }
						/>
						<ToggleControl
							label={ __( 'Repeat Background', 'guten-bridge' ) }
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

			</Fragment>
		);
	};
}, 'withBackgroundImageControl' );

addFilter(
	'editor.BlockEdit',
	'guten-bridge/extend/background-image/with-control',
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

		if ( ! hasBlockSupport( name, 'BackgroundImage' ) ) {
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

		const className = classnames();

		let customData = {};

		if ( url ) {
			customData[ 'data-background-image' ] = url;
		}
		if ( backgroundSize ) {
			customData[ 'data-background-size' ] = backgroundSize;
		}

		let wrapperProps 	= props.wrapperProps;

		wrapperProps = {
			...wrapperProps,
			...customData,
		};

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'withBackgroundImageBlockAttributes' );

wp.hooks.addFilter(
	'editor.BlockListBlock',
	'guten-bridge/extend/background-image/with-block-attributes',
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
	if ( ! hasBlockSupport( blockType.name, 'BackgroundImage' ) ) {
		return extraProps;
	}

	const {
		backgroundType,
		url,
		backgroundSize,
		hasParallax,
		hasRepete,
	} = attributes;

	if ( hasBlockSupport( blockType.name, 'BackgroundImage' ) && url ) {
		const style = backgroundType === IMAGE_BACKGROUND_TYPE ?
			backgroundImageStyles( url ) :
			{};

		if ( backgroundSize ) {
			style.backgroundSize = backgroundSize;
		}

		extraProps.style = style;

		extraProps.className = classnames(
			extraProps.className,
			{
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
	'guten-bridge/extend/background-image/get-save-content',
	getSaveBackgroundImageContent
);
