'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/media-text', {
	name: 'media-round',
	label: __( 'Round', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/media-text', {
	name: 'media-round-corner',
	label: __( 'Round Corner', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/media-text', {
	name: 'media-voice',
	label: __( 'Voice', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/media-text', {
	name: 'media-thinking',
	label: __( 'Thinking', 'editor-bridge' ),
} );
