'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-no-style',
	label: __( 'No Style', 'guten-plus' )
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-underline',
	label: __( 'Underline', 'guten-plus' )
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-underline-emphasis',
	label: __( 'Underline Emphasis', 'guten-plus' ),
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-dashed',
	label: __( 'Dashed', 'guten-plus' ),
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-round-corner',
	label: __( 'Round Corner', 'guten-plus' ),
} );
