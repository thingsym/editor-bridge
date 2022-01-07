/**
* External dependencies
*/
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import {
	default as InlineFontWeightUI,
	getActiveFontWeight,
	setStyle,
} from '../../font-weight-popover.js';

describe( 'InlineFontWeightUI', () => {
	it( 'InlineFontWeightUI renders', () => {
		const wrapper = shallow( <InlineFontWeightUI /> );
		expect( wrapper ).toBeTruthy();
	} );
} );

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
