/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { sliderRectOffSet, dummyText } from './utils/utils';

test.describe( '@editor-bridge style', () => {
	test.beforeEach( async ({ page } ) => {
		await page.goto( '/wp-login.php' );
		await page.getByLabel( 'Username or Email Address' ).click();
		await page.getByLabel( 'Username or Email Address' ).fill( `${process.env.WP_USERNAME}` );
		await page.getByLabel( 'Username or Email Address' ).press( 'Tab' );
		await page.getByLabel( 'Password', { exact: true } ).fill( `${process.env.WP_PASSWORD}` );
		await page.getByRole( 'button', { name: 'Log In' } ).click();

		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForLoadState();

		const isVisibleModal = await page.locator( '.components-modal__frame[role="Close dialogdialog"][aria-label="Welcome to the block editor"]' ).isVisible();
		if ( isVisibleModal ) {
			await page.locator( 'button[aria-label="Close dialog"]' ).click();
		}

		await expect( page.locator( '.components-modal__frame[role="Close dialogdialog"][aria-label="Welcome to the block editor"]' ) ).not.toBeVisible();
	} );

	test.afterEach( async ({ page }, testInfo ) => {
		// delete uploaded image
		if ( testInfo.titlePath.includes( 'image style' )
			|| testInfo.titlePath.includes( 'media-text style' ) ) {
			await page.goto( '/wp-admin/upload.php' );
			await page.waitForLoadState();

			await page.locator( '.attachments' ).getByLabel( 'sample', { exact: true } ).click();
			page.once( 'dialog', async dialog => {
				console.log( `Dialog message: ${dialog.message()}` );
				await dialog.accept();
				// await dialog.dismiss();
			});
			await page.locator( '.attachment-info' ).getByRole( 'button', { name: 'Delete permanently' } ).click();
		}
	} );

	test( 'heading style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/heading' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Heading', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( 'test' );
		await page.locator( 'h2[data-type="core/heading"]' ).click();

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}
		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Underline', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Thin Underline', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Thick Underline', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Two Color Underline', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Up Down Line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Accent Line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Kebab Line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Single Box', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Double Box', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Left Accent Line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Gradation Line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Stripe Line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Cross Box', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Brackets', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Japanese quotation marks', exact: true } ) ).toBeVisible();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Underline', exact: true } ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:heading {"className":"is-style-hd-underline"} -->
<h2 class="wp-block-heading is-style-hd-underline">test</h2>
<!-- /wp:heading -->`
		);

	} );

	test( 'separator style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/separator' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Separator', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Thick line', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Dotted', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Asterisk', exact: true } ) ).toBeVisible();

	} );

	test( 'button style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/buttons' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Buttons', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		await page.getByRole( 'document', { name: 'Block: Buttons', exact: true } ).getByRole( 'textbox', { name: 'Button text' } ).nth(0).fill( 'test' );
		await page.keyboard.press( 'Enter' );

		await page.getByRole( 'document', { name: 'Block: Buttons', exact: true } ).getByRole( 'textbox', { name: 'Button text' } ).nth(0).click();

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}
		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Triangle Icon', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Blur', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Shadow', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Expansion', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Emboss', exact: true } ) ).toBeVisible();

	} );

	test( 'list style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/list' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'List', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		await page.getByRole( 'document', { name: 'Block: List', exact: true } ).getByRole( 'textbox', { name: 'List text' } ).nth(0).fill( 'test' );
		await page.keyboard.press( 'Enter' );
		await page.getByRole( 'document', { name: 'Block: List', exact: true } ).getByRole( 'textbox', { name: 'List text' } ).nth(1).fill( 'test' );
		await page.keyboard.press( 'Enter' );
		await page.getByRole( 'document', { name: 'Block: List', exact: true } ).getByRole( 'textbox', { name: 'List text' } ).nth(2).fill( 'test' );

		await page.getByRole( 'toolbar', { name: 'Document tools' } ).getByRole( 'button', { name: 'Document Overview' } ).click();
		await page.getByRole( 'treegrid', { name: 'Block navigation structure' } ).getByRole( 'link', { name: 'List', exact: true } ).click();
		await page.getByRole( 'region', { name: 'Document Overview' } ).getByRole( 'button', { name: 'Close' } ).click();

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}
		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'No Style', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Inline', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Columns', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Square', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Circle', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Reference Mark', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Reference Mark (Inline)', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Centered', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Icon', exact: true } ) ).toBeVisible();

	} );

	test( 'image style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/image' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Image', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		const [ fileChooser ] = await Promise.all([
			page.waitForEvent( 'filechooser' ),
			page.locator( '.components-form-file-upload' ).getByRole( 'button', { name: 'Upload' } ).click(),
		]);

		await fileChooser.setFiles( './tests/playwright/sample.png' );
		await page.waitForTimeout(3000);

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}
		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Round Corner', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Frame', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Shadow', exact: true } ) ).toBeVisible();

	} );

	test( 'media-text style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/media-text' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Media & Text', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		const [ fileChooser ] = await Promise.all([
			page.waitForEvent( 'filechooser' ),
			page.locator( '.components-form-file-upload' ).getByRole( 'button', { name: 'Upload' } ).click(),
		]);

		await fileChooser.setFiles( './tests/playwright/sample.png' );
		await page.waitForTimeout(3000);

		await page.locator( '.wp-block-media-text__content' ).getByRole( 'document', { name: 'Empty block; start writing or type forward slash to choose a block' } ).fill( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}
		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await page.locator( '.editor-styles-wrapper' ).getByLabel( 'Block: Media & Text' ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Round', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Round Corner', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Voice', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Thinking', exact: true } ) ).toBeVisible();

	} );

	test( 'table style', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/table' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Table', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		page.getByRole( 'document', { name: 'Block: Table' } ).getByLabel( 'Column count' ).fill( '3' );
		await page.waitForTimeout(100);
		page.getByRole( 'document', { name: 'Block: Table' } ).getByLabel( 'Row count' ).fill( '3' );
		page.getByRole( 'document', { name: 'Block: Table' } ).getByRole( 'button', { name: 'Create Table' } ).click();

		for ( const i in Array(9).fill(0) ) {
			await page.getByRole( 'document', { name: 'Block: Table', exact: true } ).getByRole( 'textbox', { name: 'Body cell text' } ).nth( i ).fill( 'test' );
		}
		await page.getByRole( 'document', { name: 'Block: Table', exact: true } ).getByRole( 'textbox', { name: 'Table caption text' } ).fill( 'test' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}
		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Frame', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'No Style', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Underline', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Dashed', exact: true } ) ).toBeVisible();
		await expect( page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Round Corner', exact: true } ) ).toBeVisible();

	} );

} );
