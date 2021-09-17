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
	name: 'hr-asterisk',
	label: __( 'Asterisk', 'editor-bridge' ),
} );
