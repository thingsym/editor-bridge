/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( '@initial HTML block', () => {
	test.beforeEach( async ({ page } ) => {
		await page.goto( '/wp-login.php' );
		await page.getByLabel( 'Username or Email Address' ).click();
		await page.getByLabel( 'Username or Email Address' ).fill( `${process.env.WP_USERNAME}` );
		await page.getByLabel( 'Username or Email Address' ).press( 'Tab' );
		await page.getByLabel( 'Password', { exact: true } ).fill( `${process.env.WP_PASSWORD}` );
		await page.getByRole( 'button', { name: 'Log In' } ).click();

		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForLoadState();

		const isVisibleModal = await page
			.locator( '.components-modal__frame[role="Close dialogdialog"][aria-label="Welcome to the block editor"]' )
			.isVisible();
		if ( isVisibleModal ) {
			await page
				.locator( 'button[aria-label="Close dialog"]' )
				.click();
		}

		await expect(
			page.locator( '.components-modal__frame[role="Close dialogdialog"][aria-label="Welcome to the block editor"]' )
		).not.toBeVisible();
	} );

	test( 'can be created by typing "/html"', async ({ editor, page }) => {
		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();

		await page.keyboard.type( '/html' );
		await expect(
			page
				.locator( '.components-autocomplete__popover' )
				.getByRole( 'option', { name: 'Custom HTML', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( '<p>Pythagorean theorem: ' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type(
			'<var>a</var><sup>2</sup> + <var>b</var><sup>2</sup> = <var>c</var><sup>2</sup> </p>'
		);

		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:html -->
<p>Pythagorean theorem: 
<var>a</var><sup>2</sup> + <var>b</var><sup>2</sup> = <var>c</var><sup>2</sup> </p>
<!-- /wp:html -->`
		);
	} );

	test( 'should not encode <', async ({ editor, page }) => {
		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();

		await page.keyboard.type( '/html' );
		await expect(
			page
				.locator( '.components-autocomplete__popover' )
				.getByRole( 'option', { name: 'Custom HTML', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( '1 < 2' );

		// await editor.publishPost();
		// await page.reload();
		// await page.waitForSelector( 'iframe[title="Editor canvas"i]' );

		await expect(
			editor.canvas
				.locator( '[data-type="core/html"] textarea' )
		).toBeVisible();
	} );
} );
