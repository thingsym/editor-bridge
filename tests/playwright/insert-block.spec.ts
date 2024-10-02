/**
 * WordPress dependencies1
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( '@default-editor insert block', () => {
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

	test( 'insert block via block appender', async ({ editor, page }) => {
		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();

		await page.keyboard.type( '/heading' );
		// await page.locator( 'role=document' ).fill( '/heading' );

		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Heading', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( 'add block via block appender' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via block appender' );
	} );

	test( 'insert block via quick inserter / search', async ({ editor, page }) => {
		await page.locator( '.block-editor-inserter' ).getByRole( 'button', { name: 'Add block' } ).click();

		await page.keyboard.type( '/heading' );
		await expect(
			page.locator( '.block-editor-inserter__quick-inserter' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } )
		).toBeVisible();

		await page.locator( '.block-editor-inserter__quick-inserter' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } ).click();
		await page.keyboard.type( 'add block via quick inserter' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via quick inserter' );
	} );

	test( 'insert block via quick inserter / Browse all', async ({ editor, page }) => {
		await page.locator( '.block-editor-inserter' ).getByRole( 'button', { name: 'Add block' } ).click();

		await page.locator( '.block-editor-inserter__quick-inserter' ).getByText( 'Browse all', { exact: true } ).click();

		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Heading' } )
		).toBeVisible();

		await page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Heading' } ).click();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();
		await page.locator( 'h2[data-type="core/heading"]' ).click();

		await page.keyboard.type( 'add block via quick inserter / Browse all' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via quick inserter / Browse all' );
	} );

	test( 'insert block via Toggle block inserter / search', async ({ editor, page }) => {
		await page.getByLabel( 'Toggle block inserter', { exact: true } ).click();
		await page.waitForTimeout(1000);
		await page.locator( '.block-editor-inserter__tablist' ).getByRole( 'tab', { name: 'Blocks' } ).click()
		await page.locator( '.block-editor-inserter__search' ).getByPlaceholder( 'Search' ).click();
		await page.keyboard.type( '/heading' );

		// await page.screenshot({ path: 'tests/playwright-screenshot.png' });
		// await page.getByLabel('Close block inserter').click();


		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } )
		).toBeVisible();

		await page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } ).click();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();
		await page.locator( 'h2[data-type="core/heading"]' ).click();

		await page.keyboard.type( 'add block via Toggle block inserter' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via Toggle block inserter' );
	} );

	test( 'insert block via Toggle block inserter / list select', async ({ editor, page }) => {
		await page.getByLabel( 'Toggle block inserter', { exact: true } ).click();
		await page.waitForTimeout(1000);

		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Heading' } )
		).toBeVisible();

		await page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Heading' } ).click();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();
		await page.locator( 'h2[data-type="core/heading"]' ).click();

		await page.keyboard.type( 'add block via Toggle block inserter' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via Toggle block inserter' );
	} );

	test( 'insert block via Toggle block inserter / drag and drop', async ({ editor, page }) => {
		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();

		await page.getByLabel( 'Toggle block inserter', { exact: true } ).click();
		await page.waitForTimeout(1000);

		await page.locator( '.block-editor-inserter__tablist' ).getByRole( 'tab', { name: 'Blocks' } ).click()
		await page.locator( '.block-editor-inserter__search' ).getByPlaceholder( 'Search' ).click();
		await page.keyboard.type( '/heading' );
		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } )
		).toBeVisible();

		const sourceRect = await page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } ).boundingBox();

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' )
		).toBeVisible();

		const targetRect = await page.locator( 'p[data-type="core/paragraph"]' ).first().boundingBox();

		await page.mouse.move( sourceRect.x + sourceRect.width / 2, sourceRect.y + sourceRect.height / 2 );
		await page.mouse.down();
		await page.mouse.move( targetRect.x + targetRect.width / 2, targetRect.y + targetRect.height / 2 );
		await page.mouse.up();

		await page.keyboard.type( 'add block via Toggle block inserter / drag and drop' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via Toggle block inserter / drag and drop' );

		const targetRect1 = await page.locator( 'h2[data-type="core/heading"]' ).first().boundingBox();

		await page.getByLabel( 'Toggle block inserter', { exact: true } ).click();
		await page.waitForTimeout(1000);

		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Paragraph' } )
		).toBeVisible();

		const sourceRect1 = await page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Paragraph' } ).boundingBox();

		await page.mouse.move( sourceRect1.x + sourceRect1.width / 2, sourceRect1.y + sourceRect1.height / 2 );
		await page.mouse.down();
		await page.mouse.move( targetRect1.x + targetRect1.width / 2, targetRect1.y );
		await page.mouse.up();

		await page.locator( 'p[data-type="core/paragraph"]' ).first().click();
		await page.locator( 'p[data-type="core/paragraph"]' ).first().click();
		await page.keyboard.type( 'add block via Toggle block inserter / drag and drop / before' );

		// await page.locator( 'p[data-type="core/paragraph"]' ).first().highlight();
		// await page.screenshot({ path: 'tests/playwright-screenshot.png' });

		// await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Update' } ).click();
		// await page.reload();
		// await page.waitForSelector( 'iframe[title="Editor canvas"i]' );

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).first()
		).toBeVisible();

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).first()
		).toHaveText( 'add block via Toggle block inserter / drag and drop / before' );

		const targetRect2 = await page.locator( 'h2[data-type="core/heading"]' ).first().boundingBox();
		await page.getByLabel( 'Toggle block inserter', { exact: true } ).click();
		await page.waitForTimeout(1000);

		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Text', { exact: true } ).getByRole( 'option', { name: 'Paragraph' } )
		).toBeVisible();

		await page.mouse.move( sourceRect1.x + sourceRect1.width / 2, sourceRect1.y + sourceRect1.height / 2 );
		await page.mouse.down();
		await page.mouse.move( targetRect2.x + targetRect2.width / 2, targetRect2.y + targetRect2.height - 12 );
		await page.mouse.up();

		await page.locator( 'p[data-type="core/paragraph"]' ).last().click();
		await page.keyboard.type( 'add block via Toggle block inserter / drag and drop / after' );

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).last()
		).toBeVisible();

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).last()
		).toHaveText( 'add block via Toggle block inserter / drag and drop / after' );

	} );

	test.skip( 'insert block via insertion point inserter', async ({ editor, page }) => {
		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();

		await page.keyboard.type( 'test / insertion point inserter upper' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.type( 'test / insertion point inserter bottom' );

		const paragraphRect = await page.locator( 'p[data-type="core/paragraph"]' ).first().boundingBox();
		// console.log(paragraphRect);
		await page.mouse.click( paragraphRect.x + paragraphRect.width / 2, paragraphRect.y + paragraphRect.height + 12 );
		await page.waitForTimeout(3000);
		await page.mouse.click( paragraphRect.x + paragraphRect.width / 2, paragraphRect.y + paragraphRect.height + 12 );

		await page.waitForTimeout(3000);

		await page.waitForSelector( '.block-editor-inserter > .block-editor-inserter__toggle' );

		await expect(
			page.locator( '.block-editor-inserter > .block-editor-inserter__toggle' )
		).toBeVisible();

		await page.locator( '.block-editor-block-list__insertion-point-inserter > .block-editor-inserter' ).getByLabel( 'Add block' ).click();

		await page.keyboard.type( '/heading' );
		await expect(
			page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } )
		).toBeVisible();

		await page.locator( '.block-editor-inserter__panel-content' ).getByLabel( 'Blocks', { exact: true } ).getByRole( 'option', { name: 'Heading' } ).click();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();
		await page.locator( 'h2[data-type="core/heading"]' ).click();

		await page.keyboard.type( 'add block via insertion point inserter' );

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toBeVisible();

		await expect(
			page.locator( 'h2[data-type="core/heading"]' )
		).toHaveText( 'add block via insertion point inserter' );

	} );

	test( 'insert block via settings menu', async ({ editor, page }) => {
		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();

		await page.keyboard.type( 'test' );

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' )
		).toBeVisible();

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' )
		).toHaveText( 'test' );

		await page.locator( 'p[data-type="core/paragraph"]' ).first().click();
		// await page.frameLocator('iframe[name="editor-canvas"]').getByLabel('Paragraph block').first().click();

		await page.getByLabel( 'Block tools' ).getByLabel( 'Options' ).click();
		await page.getByRole( 'menuitem', { name: 'Add before ⌥⌘T', exact: true } ).click();

		await page.keyboard.type( 'Add before' );

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).first()
		).toBeVisible();

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).first()
		).toHaveText( 'Add before' );

		await page.locator( 'p[data-type="core/paragraph"]' ).nth(1).click();

		await page.getByLabel( 'Block tools' ).getByLabel( 'Options' ).click();
		await page.getByRole( 'menuitem', { name: 'Add after ⌥⌘Y', exact: true } ).click();

		await page.keyboard.type( 'Add after' );

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).last()
		).toBeVisible();

		await expect(
			page.locator( 'p[data-type="core/paragraph"]' ).last()
		).toHaveText( 'Add after' );

	} );

} );
