/**
 * Internal dependencies
 */
import { badge } from '../../index';

describe( 'badge', () => {
	it( 'basic', () => {
		expect( badge.name ).toBe( 'editor-bridge/badge' );
		expect( badge.title ).toBe( 'Badge' );
		expect( badge.tagName ).toBe( 'span' );
		expect( badge.className ).toBe( 'editor-bridge-has-badge' );
		expect( badge.attributes.style ).toBe( 'style' );
		expect( badge.attributes.class ).toBe( 'class' );
	} );
} );
