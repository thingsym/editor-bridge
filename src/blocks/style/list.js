'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-no-style',
	label: __( 'No Style', 'editor-bridge' )
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-inline',
	label: __( 'Inline', 'editor-bridge' )
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-columns',
	label: __( 'Columns', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-square',
	label: __( 'Square', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-circle',
	label: __( 'Circle', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-reference',
	label: __( 'Reference Mark', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-inline-reference',
	label: __( 'Reference Mark (Inline)', 'editor-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/list', {
	name: 'list-centered',
	label: __( 'Centered', 'editor-bridge' ),
} );
