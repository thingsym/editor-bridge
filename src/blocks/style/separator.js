'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-thick-line',
	label: __( 'Thick line', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-dotted',
	label: __( 'Dotted', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-shadow',
	label: __( 'Shadow', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-circle-mark',
	label: __( 'Circle Mark', 'editor-bridge' ),
} );
