'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-no-style',
	label: __( 'No Style', 'editor-bridge' )
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-underline',
	label: __( 'Underline', 'editor-bridge' )
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-dashed',
	label: __( 'Dashed', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-round-corner',
	label: __( 'Round Corner', 'editor-bridge' ),
} );
