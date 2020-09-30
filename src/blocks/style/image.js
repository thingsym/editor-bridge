'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/image', {
	name: 'img-round-corner',
	label: __( 'Round Corner', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/image', {
	name: 'img-frame',
	label: __( 'Frame', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/image', {
	name: 'img-shadow',
	label: __( 'Shadow', 'guten-bridge' ),
} );
