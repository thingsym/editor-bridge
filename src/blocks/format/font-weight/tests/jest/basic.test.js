/**
 * Internal dependencies
 */
 import { fontWeight } from '../../index';

describe( 'fontWeight', () => {
	it( 'basic', () => {
		expect( fontWeight.name ).toBe( 'editor-bridge/font-weight' );
		expect( fontWeight.title ).toBe( 'Font Weight' );
		expect( fontWeight.tagName ).toBe( 'span' );
		expect( fontWeight.className ).toBe( 'editor-bridge-has-font-weight' );
		expect( fontWeight.attributes.style ).toBe( 'style' );
		expect( fontWeight.attributes.class ).toBe( 'class' );
	} );
} );
