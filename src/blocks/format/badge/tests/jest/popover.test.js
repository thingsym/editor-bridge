/**
 * Internal dependencies
 */
import {
	default as InlineBadgeUI,
	getActiveColorHex,
	getActiveBackgroundColorHex,
	getActiveClassNameSlug,
	setStyle,
} from '../../badge-popover.js';

describe( 'getActiveColorHex', () => {
	it( 'no parameter', () => {
		expect( getActiveColorHex() ).toBe( undefined );
		expect( getActiveColorHex( '', {}, '' ) ).toBe( undefined );
	} );

} );

describe( 'getActiveBackgroundColorHex', () => {
	it( 'no parameter', () => {
		expect( getActiveBackgroundColorHex() ).toBe( undefined );
		expect( getActiveBackgroundColorHex( '', {}, '' ) ).toBe( undefined );
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
		expect( setStyle() ).toBe( '' );
	} );

	it( 'has parameter', () => {
		expect( setStyle( 'default' ) ).toBe( '' );

		expect( setStyle( 'default', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#dddddd;padding:.2rem .8em;' );
		expect( setStyle( 'default', '#ccc', '#ddd' ) ).toBe( 'color:#ccc;background-color:#ddd;padding:.2rem .8em;' );

		expect( setStyle( 'default', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#dddddd;padding:.2rem .8em;' );
		expect( setStyle( 'round-corner', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#dddddd;padding:.2rem .8em;border-radius:.5rem;' );
		expect( setStyle( 'round', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#dddddd;padding:.2rem .8em;border-radius:2rem;' );
		expect( setStyle( 'outline', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#fff;border:solid 1px #dddddd;padding:.2rem .8em;' );
		expect( setStyle( 'status', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#fff;border:solid 1px #dddddd;padding:.2rem .8em;border-radius:2rem;' );
		expect( setStyle( 'perfect-circle', '#cccccc', '#dddddd' ) ).toBe( 'color:#cccccc;background-color:#dddddd;border-radius:50%;display:inline-block;text-align:center;' );
	} );

	it( 'out of range classNameSlug parameter', () => {
		expect( setStyle( 'aaa' ) ).toBe( '' );
	} );

} );
