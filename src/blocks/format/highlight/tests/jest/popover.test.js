/**
* External dependencies
*/
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import {
	default as InlineHighlightUI,
	getActiveColorHex,
	getActiveClassNameSlug,
	setStyle,
} from '../../highlight-popover.js';

describe( 'InlineHighlightUI', () => {
	it( 'InlineHighlightUI renders', () => {
		const wrapper = shallow( <InlineHighlightUI /> );
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
		expect( setStyle() ).toBe( 'background: linear-gradient(transparent 70%, rgba(204, 204, 204, 0.6) 30%);' );
	} );

	it( 'has parameter', () => {
		expect( setStyle( 'highlight' ) ).toBe( 'background: linear-gradient(transparent 70%, rgba(204, 204, 204, 0.6) 30%);' );

		expect( setStyle( 'highlight', '#dddddd' ) ).toBe( 'background: linear-gradient(transparent 70%, rgba(221, 221, 221, 0.6) 30%);' );
		expect( setStyle( 'highlight', '#ddd' ) ).toBe( 'background: linear-gradient(transparent 70%, rgba(221, 221, 221, 0.6) 30%);' );

		expect( setStyle( 'highlight', '#dddddd' ) ).toBe( 'background: linear-gradient(transparent 70%, rgba(221, 221, 221, 0.6) 30%);' );
		expect( setStyle( 'marker', '#dddddd' ) ).toBe( 'background-color: #dddddd;' );
		expect( setStyle( 'underline', '#dddddd' ) ).toBe( 'border-bottom: solid 2px #dddddd;' );
		expect( setStyle( 'dot', '#dddddd' ) ).toBe( 'text-emphasis-style: filled circle;-webkit-text-emphasis-style: filled circle;text-emphasis-color: #dddddd;-webkit-text-emphasis-color: #dddddd;' );
	} );

	it( 'out of range classNameSlug parameter', () => {
		expect( setStyle( 'aaa' ) ).toBe( undefined );
	} );

} );
