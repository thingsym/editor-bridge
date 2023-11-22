/**
 * Internal dependencies
 */
import {
	default as InlineFontSizeUI,
	getActiveFontSize,
} from '../../font-size-popover.js';

describe( 'getActiveFontSize', () => {
	it( 'no parameter', () => {
		expect( getActiveFontSize() ).toBe( undefined );
		expect( getActiveFontSize( '', {}, '' ) ).toBe( undefined );
	} );

} );
