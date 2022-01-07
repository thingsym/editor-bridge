/**
 * Internal dependencies
 */
 import { highlight } from '../../index';

describe( 'highlight', () => {
	it( 'basic', () => {
		expect( highlight.name ).toBe( 'editor-bridge/highlight' );
		expect( highlight.title ).toBe( 'Highlight' );
		expect( highlight.tagName ).toBe( 'span' );
		expect( highlight.className ).toBe( 'editor-bridge-has-highlight' );
		expect( highlight.attributes.style ).toBe( 'style' );
		expect( highlight.attributes.class ).toBe( 'class' );
	} );
} );
