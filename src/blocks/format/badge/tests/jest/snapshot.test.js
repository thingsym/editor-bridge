/**
* External dependencies
*/
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

/**
 * Internal dependencies
 */
import {
	default as InlineBadgeUI,
} from '../../badge-popover.js';

describe( 'InlineBadgeUI snapshot', () => {
	it( 'InlineBadgeUI snapshot', () => {
		const elem = shallowToJson( shallow( <InlineBadgeUI /> ) );
		expect( elem ).toMatchSnapshot();
	} );
} );
