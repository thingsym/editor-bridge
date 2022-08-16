/**
 * Internal dependencies
 */
 import { fontSize } from '../../index';

describe( 'fontSize', () => {
	it( 'basic', () => {
		expect( fontSize.name ).toBe( 'editor-bridge/font-size' );
		expect( fontSize.title ).toBe( 'Font Size' );
		expect( fontSize.tagName ).toBe( 'span' );
		expect( fontSize.className ).toBe( 'editor-bridge-has-font-size' );
		expect( fontSize.attributes.style ).toBe( 'style' );
		expect( fontSize.attributes.class ).toBe( 'class' );
	} );
} );
