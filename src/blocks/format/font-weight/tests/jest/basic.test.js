/**
 * Internal dependencies
 */
 import { font_weight } from '../../index';

describe( 'font-weight', () => {
	it( 'basic', () => {
		expect( font_weight.name ).toBe( 'editor-bridge/font-weight' );
		expect( font_weight.title ).toBe( 'Font Weight' );
		expect( font_weight.tagName ).toBe( 'span' );
		expect( font_weight.className ).toBe( 'editor-bridge-has-font-weight' );
		expect( font_weight.attributes.style ).toBe( 'style' );
		expect( font_weight.attributes.class ).toBe( 'class' );
	} );
} );
