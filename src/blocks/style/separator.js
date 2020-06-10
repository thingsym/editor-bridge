'use strict';
const { __ } = wp.i18n;

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-bold-line',
	label: __( 'Bold line', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-dotted',
	label: __( 'Dotted', 'guten-bridge' ),
} );

wp.blocks.registerBlockStyle( 'core/separator', {
	name: 'hr-shadow',
	label: __( 'Shadow', 'guten-bridge' ),
} );
