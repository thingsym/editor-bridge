'use strict';
const { __ } = wp.i18n;

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-no-style',
	label: __( 'No Style', 'guten-bridge' )
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-underline',
	label: __( 'Underline', 'guten-bridge' )
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-underline-emphasis',
	label: __( 'Underline Emphasis', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-underline-emphasis',
	label: __( 'Underline Emphasis', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-dashed',
	label: __( 'Dashed', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/table', {
	name: 'tb-round-corners',
	label: __( 'Rounded Corners', 'guten-bridge' ),
} );
