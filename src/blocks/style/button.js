'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-triangle-icon',
	label: __( 'Triangle Icon', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-blur',
	label: __( 'Blur', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-shadow',
	label: __( 'Shadow', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-expansion',
	label: __( 'Expansion', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-emboss',
	label: __( 'Emboss', 'editor-bridge' ),
} );

