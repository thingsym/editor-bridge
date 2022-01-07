/**
* External dependencies
*/
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import {
	default as InlineFontSizeUI,
	getActiveFontSize,
} from '../../font-size-popover.js';

describe( 'InlineFontSizeUI', () => {
	it( 'InlineFontSizeUI renders', () => {
		const wrapper = shallow( <InlineFontSizeUI /> );
		expect( wrapper ).toBeTruthy();
	} );
} );

describe( 'getActiveFontSize', () => {
	it( 'no parameter', () => {
		expect( getActiveFontSize() ).toBe( undefined );
		expect( getActiveFontSize( '', {}, '' ) ).toBe( undefined );
	} );

} );
