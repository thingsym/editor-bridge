/**
 * Internal dependencies
 */
import {
	default as InlineFontWeightUI,
	getActiveFontWeight,
	setStyle,
} from '../../font-weight-popover.js';

describe( 'getActiveFontWeight', () => {
	it( 'no parameter', () => {
		expect( getActiveFontWeight() ).toBe( undefined );
		expect( getActiveFontWeight( '', {}, '' ) ).toBe( undefined );
	} );
} );

describe( 'setStyle', () => {
	it( 'no parameter', () => {
		expect( setStyle() ).toBe( undefined );
	} );
} );
