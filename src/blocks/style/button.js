'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-triangle-icon',
	label: __( 'Triangle Icon', 'guten-plus' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-blur',
	label: __( 'Blur', 'guten-plus' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-shadow',
	label: __( 'Shadow', 'guten-plus' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-expansion',
	label: __( 'Expansion', 'guten-plus' ),
} );

wp.blocks.registerBlockStyle( 'core/button', {
	name: 'bt-emboss',
	label: __( 'Emboss', 'guten-plus' ),
} );

