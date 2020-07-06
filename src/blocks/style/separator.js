'use strict';
const { __ } = wp.i18n;

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-thick-line',
	label: __( 'Thick line', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-dotted',
	label: __( 'Dotted', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-shadow',
	label: __( 'Shadow', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-circle-mark',
	label: __( 'Circle Mark', 'guten-bridge' ),
} );
