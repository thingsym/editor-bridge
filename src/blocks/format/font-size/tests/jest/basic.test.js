/**
 * Internal dependencies
 */
 import { font_size } from '../../index';

describe( 'font-size', () => {
	it( 'basic', () => {
		expect( font_size.name ).toBe( 'editor-bridge/font-size' );
		expect( font_size.title ).toBe( 'Font Size' );
		expect( font_size.tagName ).toBe( 'span' );
		expect( font_size.className ).toBe( 'editor-bridge-has-font-size' );
		expect( font_size.attributes.style ).toBe( 'style' );
		expect( font_size.attributes.class ).toBe( 'class' );
	} );
} );
