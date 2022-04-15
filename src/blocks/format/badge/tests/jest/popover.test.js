/**
* External dependencies
*/
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import {
	default as InlineBadgeUI,
	getActiveColorHex,
	getActiveClassNameSlug,
	setStyle,
} from '../../badge-popover.js';

describe( 'InlineBadgeUI', () => {
	it( 'InlineBadgeUI renders', () => {
		const wrapper = shallow( <InlineBadgeUI /> );
		expect( wrapper ).toBeTruthy();
	} );
} );

describe( 'getActiveColorHex', () => {
	it( 'no parameter', () => {
		expect( getActiveColorHex() ).toBe( undefined );
		expect( getActiveColorHex( '', {}, '' ) ).toBe( undefined );
	} );

} );

describe( 'getActiveClassNameSlug', () => {
	it( 'no parameter', () => {
		expect( getActiveClassNameSlug() ).toBe( undefined );
		expect( getActiveClassNameSlug( '', {} ) ).toBe( undefined );
	} );

	it( 'has parameter', () => {
		expect( getActiveClassNameSlug( 'a', 'a' ) ).toBe( undefined );
	} );
} );

describe( 'setStyle', () => {
	it( 'no parameter', () => {
		expect( setStyle() ).toBe( 'background-color: #cccccc;padding: .2rem .8em;' );
	} );

	it( 'has parameter', () => {
		expect( setStyle( 'default' ) ).toBe( 'background-color: #cccccc;padding: .2rem .8em;' );

		expect( setStyle( 'default', '#dddddd' ) ).toBe( 'background-color: #dddddd;padding: .2rem .8em;' );
		expect( setStyle( 'default', '#ddd' ) ).toBe( 'background-color: #ddd;padding: .2rem .8em;' );

		expect( setStyle( 'default', '#dddddd' ) ).toBe( 'background-color: #dddddd;padding: .2rem .8em;' );
		expect( setStyle( 'round-corner', '#dddddd' ) ).toBe( 'background-color: #dddddd;padding: .2rem .8em;border-radius: .5rem;' );
		expect( setStyle( 'round', '#dddddd' ) ).toBe( 'background-color: #dddddd;padding: .2rem .8em;border-radius: 2rem;' );
		expect( setStyle( 'outline', '#dddddd' ) ).toBe( 'background-color: #fff;border: solid 1px #dddddd;padding: .2rem .8em;' );
		expect( setStyle( 'status', '#dddddd' ) ).toBe( 'background-color: #fff;border: solid 1px #dddddd;padding: .2rem .8em;border-radius: 2rem;' );
		expect( setStyle( 'perfect-circle', '#dddddd' ) ).toBe( 'background-color: #dddddd;border-radius: 50%;display: inline-block;text-align: center;' );
	} );

	it( 'out of range classNameSlug parameter', () => {
		expect( setStyle( 'aaa' ) ).toBe( undefined );
	} );

} );
