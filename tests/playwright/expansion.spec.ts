/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { sliderRectOffSet, dummyText } from './utils/utils';

test.describe( '@editor-bridge expansion', () => {
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
		if ( testInfo.titlePath.includes( 'background image expansion' ) ) {
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

	test( 'Border expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( 'p[data-type="core/paragraph"]' ).click();

		// if ( ! page.getByLabel( 'Editor settings' ).getByRole( 'button', { name: 'Block (selected)', exact: true } ).isVisible() ) {
		// 	await page.getByLabel( 'Editor settings' ).getByRole( 'button', { name: 'Block', exact: true } ).click();
		// }

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Settings' } ).click();
		// await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		if ( await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Border settings' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Border settings', expanded: false } ).click();
		}

		const panelBody = await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Border settings' } ).locator( '../..' );

		await panelBody.getByLabel( 'Style', { exact: true } ).selectOption( 'solid' );

		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border width' } ) ).toHaveValue( '1' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid"} -->
<p style="border-style:solid">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.scrollIntoViewIfNeeded();
		const borderWidthSliderRect = await panelBody.getByRole( 'slider', { name: 'Border width' } ).boundingBox();
		await panelBody.getByRole( 'slider', { name: 'Border width' } ).click({
			position: { x: borderWidthSliderRect.width /  10 * 6, y: borderWidthSliderRect.height * 0.5 },
		});

		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border width' } ) ).toHaveValue( '6' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":6} -->
<p style="border-style:solid;border-width:6px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.getByRole( 'spinbutton', { name: 'Border width' } ).fill( '3' );
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border width' } ) ).toHaveValue( '3' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":3} -->
<p style="border-style:solid;border-width:3px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.getByRole( 'spinbutton', { name: 'Border width' } ).click();
		await panelBody.getByRole( 'spinbutton', { name: 'Border width' } ).press('ArrowUp');
		await panelBody.getByRole( 'spinbutton', { name: 'Border width' } ).press('ArrowUp');
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border width' } ) ).toHaveValue( '5' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":5} -->
<p style="border-style:solid;border-width:5px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.getByRole( 'spinbutton', { name: 'Border width' } ).press('ArrowDown');
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border width' } ) ).toHaveValue( '4' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":4} -->
<p style="border-style:solid;border-width:4px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		const borderRect = await page.locator( '.components-range-control__wrapper' ).getByLabel( 'Border width' ).boundingBox();
		await page.locator( '.components-range-control__wrapper' ).getByLabel( 'Border width' ).click({
			position: { x: borderRect.width * 0.6 + sliderRectOffSet, y: borderRect.height * 0.5 },
		});
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":7} -->
<p style="border-style:solid;border-width:7px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.getByLabel( 'Border width', { exact: true } ).locator('../..').getByRole( 'button', { name: 'Reset' } ).click();
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border width' } ) ).toHaveValue( '0' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0} -->
<p style="border-style:solid;border-width:0px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// color
		await panelBody.locator( '.components-circular-option-picker' ).getByLabel( 'Color: Primary' ).click();
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border radius' } ) ).toHaveValue( '0' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#9DFF20"} -->
<p style="border-style:solid;border-width:0px;border-color:#9DFF20">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// ColorPicker
		await page.locator( '.components-color-palette__custom-color-wrapper' ).getByRole( 'button', { name: 'Custom color picker.' } ).click();

		await page.waitForTimeout(3000);
		const saturationTextRect = await page.locator( '.react-colorful__saturation' ).getByRole( 'slider', { name: 'Color' } ).boundingBox();
		await page.locator( '.react-colorful__saturation' ).getByRole( 'slider', { name: 'Color' } ).click({
			position: { x: Number( saturationTextRect.width ) * 0.2, y: Number( saturationTextRect.height ) * 0.2 },
		});

		const hueTextRect = await page.locator( '.react-colorful__hue' ).getByRole( 'slider', { name: 'Hue' } ).boundingBox();
		await page.locator( '.react-colorful__hue' ).getByRole( 'slider', { name: 'Hue' } ).click({
			position: { x: hueTextRect.width * 0.2, y: hueTextRect.height * 0.5 },
		});

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#c4cca4"} -->
<p style="border-style:solid;border-width:0px;border-color:#c4cca4">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// DnD
		const pointerTextSource = await page.locator( '.react-colorful__saturation-pointer' );
		const pointerTextTarget = await page.locator( '.react-colorful__saturation' );
		await pointerTextSource.dragTo( pointerTextTarget, {
			targetPosition: { x: Number( saturationTextRect.width ) * 0.4, y: Number( saturationTextRect.height ) * 0.4 },
		});
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#8e995f"} -->
<p style="border-style:solid;border-width:0px;border-color:#8e995f">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page.getByLabel( 'Color format' ).selectOption( 'Hex' );
		await page.getByLabel( 'Hex color', { exact: true } ).fill( '#cccccc' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#cccccc"} -->
<p style="border-style:solid;border-width:0px;border-color:#cccccc">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page.getByLabel( 'Color format' ).selectOption( 'HSL' );
		await page.getByRole( 'spinbutton', { name: 'Hue', exact: true } ).fill( '20' );
		await page.getByRole( 'spinbutton', { name: 'Saturation', exact: true } ).fill( '20' );
		await page.getByRole( 'spinbutton', { name: 'Lightness', exact: true } ).fill( '20' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#3d3029"} -->
<p style="border-style:solid;border-width:0px;border-color:#3d3029">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page.getByLabel( 'Color format' ).selectOption( 'RGB' );
		await page.getByRole( 'spinbutton', { name: 'Red', exact: true } ).fill( '50' );
		await page.getByRole( 'spinbutton', { name: 'Green', exact: true } ).fill( '100' );
		await page.getByRole( 'spinbutton', { name: 'Blue', exact: true } ).fill( '200' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#3264c8"} -->
<p style="border-style:solid;border-width:0px;border-color:#3264c8">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// radius
		await panelBody.scrollIntoViewIfNeeded();
		const borderRadiusSliderRect = await panelBody.getByRole( 'slider', { name: 'Border radius' } ).boundingBox();
		await panelBody.getByRole( 'slider', { name: 'Border radius' } ).click({
			position: { x: borderRadiusSliderRect.width / 100 * 20 + sliderRectOffSet, y: borderRadiusSliderRect.height * 0.5 },
		});
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border radius' } ) ).toHaveValue( '20' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#3264c8","borderRadius":20} -->
<p style="border-style:solid;border-width:0px;border-color:#3264c8;border-radius:20px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.getByRole( 'spinbutton', { name: 'Border radius' } ).fill( '30' );
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border radius' } ) ).toHaveValue( '30' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#3264c8","borderRadius":30} -->
<p style="border-style:solid;border-width:0px;border-color:#3264c8;border-radius:30px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);
		await panelBody.getByLabel( 'Border radius', { exact: true } ).locator('../..').getByRole( 'button', { name: 'Reset' } ).click();
		await expect( panelBody.getByRole( 'spinbutton', { name: 'Border radius' } ) ).toHaveValue( '0' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#3264c8","borderRadius":0} -->
<p style="border-style:solid;border-width:0px;border-color:#3264c8;border-radius:0px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page.locator( 'p[data-type="core/paragraph"]' ).click();
		await page.getByLabel( 'Block tools' ).getByLabel( 'Options' ).click();
		await page.getByRole( 'menu', { name: 'Options' } ).getByRole( 'menuitem', { name: 'Copy ⌘C', exact: true } ).click();
		await expect( await page.evaluate( 'navigator.clipboard.readText()' ) ).toBe(
			`<!-- wp:paragraph {"borderStyle":"solid","borderWidth":0,"borderColor":"#3264c8","borderRadius":0} -->
<p style="border-style:solid;border-width:0px;border-color:#3264c8;border-radius:0px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// TODO: check via editor.getBlocks()
		// console.log( await editor.getBlocks() );

	} );

	test( 'Space expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( 'p[data-type="core/paragraph"]' ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Settings' } ).click();
		// await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		if ( await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Space Settings' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Space Settings', expanded: false } ).click();
		}

		const panelBody = await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Space settings' } ).locator( '../..' );

		await panelBody.getByLabel( 'Margin', { exact: true } ).selectOption( 'Large' );
		await panelBody.getByLabel( 'Padding', { exact: true } ).selectOption( 'Large' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"marginSlug":"large","paddingSlug":"large"} -->
<p class="is-margin-large is-padding-large">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await panelBody.getByLabel( 'Disable the horizontal setting' ).check();

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"marginSlug":"large","paddingSlug":"large","disablePaddingHorizontal":true} -->
<p class="is-margin-large is-padding-large disable-padding-horizontal">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

	} );

	test( 'background image expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( 'p[data-type="core/paragraph"]' ).click();
		await page.getByLabel( 'Block tools' ).getByLabel( 'Edit Background Image', { exact: true } ).click();
		await page.waitForTimeout(3000);

		// TODO: add parent locator
		// await page.getByRole( 'menu', { name: 'Edit Background Image' } ).getByRole( 'menuitem', { name: /Open Media Library/ } ).click();
		// await page.getByRole( 'menuitem', { name: /Open Media Library/ } ).highlight();
		await page.getByRole( 'menuitem', { name: /Open Media Library/ } ).click();

		const [ fileChooser ] = await Promise.all([
			page.waitForEvent( 'filechooser' ),
			page.locator( '.upload-ui' ).getByRole( 'button', { name: 'Select Files' } ).click(),
		]);

		await fileChooser.setFiles( './tests/playwright/sample.png' );
		await page.waitForTimeout(3000);
		await page.locator( '.media-toolbar' ).getByRole( 'button', { name: 'Select', exact: true } ).click();
		await expect( await editor.getEditedPostContent() ).toMatch(
			new RegExp(`<!-- wp:paragraph {"backgroundUrl":"http://localhost:8080/wp-content/uploads/\\d+/\\d+/sample.png","backgroundId":\\d+} -->
<p style="background-image:url\\(http://localhost:8080/wp-content/uploads/\\d+/\\d+/sample.png\\)" class="has-backgrond-image has-no-repete">${dummyText}</p>
<!-- /wp:paragraph -->`)
		);

	} );

	test( 'container expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/group' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Group', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );
		await page.getByRole( 'list', { name: 'Block variations' } ).getByLabel( 'Group: Gather blocks in a container.' ).click();

		await page.locator( '.block-editor-inserter' ).getByRole( 'button', { name: 'Add block' } ).click();
		await page.getByRole( 'listbox', { name: 'Blocks' }).getByRole( 'option', { name: 'Paragraph' } ).click();
		await page.getByLabel( 'Empty block; start writing or type forward slash to choose a block' ).fill( dummyText );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
		);

		await page.getByRole( 'toolbar', { name: 'Document tools' } ).getByRole( 'button', { name: 'Document Overview' } ).click();

		// await page.getByLabel( 'Block navigation structure' ).getByLabel( 'Group', { exact: true } ).click();
		// await page.getByLabel( 'Block navigation structure' ).getByRole( 'link', { name: 'Group' } ).click();
		await page.getByRole( 'treegrid', { name: 'Block navigation structure' } ).getByRole( 'link', { name: 'Group', exact: true } ).click();

		await page.getByRole( 'region', { name: 'Document Overview' } ).getByRole( 'button', { name: 'Close' } ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();
		await page.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' ).getByRole( 'button', { name: 'Color Background styles' } ).click();
		await page.locator( '.components-circular-option-picker__swatches' ).getByRole( 'option', { name: 'Color: Pale pink' } ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Settings' } ).click();

		await expect( page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Container Settings' } ) ).toBeHidden();

		await page.getByLabel( 'Block tools' ).getByLabel( 'Align', { exact: true } ).click();
		await page.getByRole( 'menu', { name: 'Align' } ).getByRole( 'menuitemradio', { name: 'Full width' } ).click();

		await expect( page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Container Settings' } ) ).toBeVisible();

		if ( await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Container Settings' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Container Settings', expanded: false } ).click();
		}

		const panelBody = await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Container settings' } ).locator( '../..' );
		await panelBody.getByLabel( 'Fix layout width' ).check();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:group {"align":"full","backgroundColor":"pale-pink","layout":{"type":"constrained"},"fixedLayoutWidth":true} -->
<div class="wp-block-group alignfull has-pale-pink-background-color has-background fixed-layout-width"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
		);

		await panelBody.getByLabel( 'Fix layout width' ).uncheck();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:group {"align":"full","backgroundColor":"pale-pink","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-pale-pink-background-color has-background"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
		);

	} );

	test( 'width expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/group' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Group', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );
		await page.getByRole( 'list', { name: 'Block variations' } ).getByLabel( 'Group: Gather blocks in a container.' ).click();

		await page.locator( '.block-editor-inserter' ).getByRole( 'button', { name: 'Add block' } ).click();
		await page.getByRole( 'listbox', { name: 'Blocks' }).getByRole( 'option', { name: 'Paragraph' } ).click();
		await page.getByLabel( 'Empty block; start writing or type forward slash to choose a block' ).fill( dummyText );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
		);

		await page.getByRole( 'toolbar', { name: 'Document tools' } ).getByRole( 'button', { name: 'Document Overview' } ).click();
		await page.getByRole( 'treegrid', { name: 'Block navigation structure' } ).getByRole( 'link', { name: 'Group', exact: true } ).click();
		await page.getByRole( 'region', { name: 'Document Overview' } ).getByRole( 'button', { name: 'Close' } ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();
		await page.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' ).getByRole( 'button', { name: 'Color Background styles' } ).click();
		await page.locator( '.components-circular-option-picker__swatches' ).getByRole( 'option', { name: 'Color: Pale pink' } ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Settings' } ).click();

		if ( await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Width Settings' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Width Settings', expanded: false } ).click();
		}

		const panelBody = await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Width settings' } ).locator( '../..' );

		await panelBody.getByRole( 'group', { name: 'Button width' } ).getByRole( 'button', { name: '50%' } ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:group {"backgroundColor":"pale-pink","layout":{"type":"constrained"},"widthSlug":"50"} -->
<div class="wp-block-group has-pale-pink-background-color has-background is-width-50"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
		);

		await panelBody.getByRole( 'group', { name: 'Button width' } ).getByRole( 'button', { name: '50%' } ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:group {"backgroundColor":"pale-pink","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-pale-pink-background-color has-background"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`
		);

	} );

	test( 'block-centered-alignment expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/columns' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Columns', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );
		await page.getByRole( 'list', { name: 'Block variations' } ).getByLabel( 'Two columns; equal split' ).click();


		await page.getByLabel( 'Block: Column (1 of 2)' ).locator( '.block-editor-inserter' ).getByRole( 'button', { name: 'Add block' } ).click();
		await page.getByRole( 'listbox', { name: 'Blocks' }).getByRole( 'option', { name: 'Paragraph' } ).click();
		// await page.locator( 'p[data-type="core/paragraph"]' ).fill( 'a' );
		await page.getByRole( 'document', { name: 'Empty block; start writing or type forward slash to choose a block' } ).fill( 'a' );

		await page.getByLabel( 'Block: Column (2 of 2)' ).click();
		await page.getByLabel( 'Block: Column (2 of 2)' ).locator( '.block-editor-inserter' ).getByRole( 'button', { name: 'Add block' } ).click();
		await page.getByRole( 'listbox', { name: 'Blocks' }).getByRole( 'option', { name: 'Paragraph' } ).click();
		// await page.locator( 'p[data-type="core/paragraph"]' ).fill( dummyText );
		await page.getByRole( 'document', { name: 'Empty block; start writing or type forward slash to choose a block' } ).fill( dummyText );

		await page.getByRole( 'toolbar', { name: 'Document tools' } ).getByRole( 'button', { name: 'Document Overview' } ).click();
		// await page.getByLabel( 'Block navigation structure' ).getByLabel( 'Columns', { exact: true } ).getByTestId( 'list-view-expander' ).click();
		await page.getByRole( 'treegrid', { name: 'Block navigation structure' } ).getByRole( 'link', { name: 'Column', exact: true } ).nth(0).click();
		await page.getByRole( 'region', { name: 'Document Overview' } ).getByRole( 'button', { name: 'Close' } ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();
		await page.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' ).getByRole( 'button', { name: 'Color Background styles' } ).click();
		await page.locator( '.components-circular-option-picker__swatches' ).getByRole( 'option', { name: 'Color: Pale pink' } ).click();
		await page.getByLabel( 'Block tools' ).getByLabel( 'Change centered alignment', { exact: true } ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"backgroundColor":"pale-pink","blockCenteredAlignment":true} -->
<div class="wp-block-column has-pale-pink-background-color has-background is-block-centered-alignment"><!-- wp:paragraph -->
<p>a</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`
		);

		await page.getByLabel( 'Block tools' ).getByLabel( 'Change centered alignment', { exact: true } ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"backgroundColor":"pale-pink"} -->
<div class="wp-block-column has-pale-pink-background-color has-background"><!-- wp:paragraph -->
<p>a</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`
		);

	} );

	test( 'button-size expansion', async ( { editor, page } ) => {
		await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

		await page.locator( '.block-editor-default-block-appender' ).getByRole( 'button', { name: 'Add default block' } ).click();
		await page.keyboard.type( '/buttons' );
		await expect(
			page.locator( '.components-autocomplete__popover' ).getByRole( 'option', { name: 'Buttons', selected: true } )
		).toBeVisible();
		await page.keyboard.press( 'Enter' );

		await page.getByRole( 'document', { name: 'Block: Buttons', exact: true } ).getByRole( 'textbox', { name: 'Button text' } ).nth(0).fill( 'test' );
		await page.keyboard.press( 'Enter' );
		await page.getByRole( 'document', { name: 'Block: Buttons', exact: true } ).getByRole( 'textbox', { name: 'Button text' } ).nth(1).fill( 'test' );

		await page.getByRole( 'document', { name: 'Block: Buttons', exact: true } ).getByRole( 'textbox', { name: 'Button text' } ).nth(0).click();

		if ( await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Size Settings' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Size Settings', expanded: false } ).click();
		}

		const panelBody = await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Size settings' } ).locator( '../..' );
		await panelBody.getByLabel( 'Size' ).selectOption( 'Large' );
		await panelBody.getByLabel( 'Width' ).selectOption( 'Half' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"buttonSizeSlug":"large","buttonWidthSlug":"half"} -->
<div class="wp-block-button is-button-size-large is-button-width-half"><a class="wp-block-button__link wp-element-button">test</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`
		);

	} );

	test( 'icon expansion', async ( { editor, page } ) => {
		await await page.getByRole( 'textbox', { name: 'Add title' } ).fill( 'test' );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page.getByLabel( 'Editor top bar' ).getByRole( 'button', { name: 'Settings' } ).click();
		}

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

		// await page.getByRole( 'document', { name: 'Block: List', exact: true } ).click();
		await page.getByRole( 'toolbar', { name: 'Document tools' } ).getByRole( 'button', { name: 'Document Overview' } ).click();
		await page.getByRole( 'treegrid', { name: 'Block navigation structure' } ).getByRole( 'link', { name: 'List', exact: true } ).click();
		await page.getByRole( 'region', { name: 'Document Overview' } ).getByRole( 'button', { name: 'Close' } ).click();

		await expect( page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Icon Settings' } ).isHidden() ).toBeTruthy();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Styles' } ).click();

		await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-styles' ).getByRole( 'button', { name: 'Icon' } ).click();

		// await page.getByLabel( 'Editor settings' ).locator( '.block-editor-block-inspector__tabs' ).getByRole( 'tab', { name: 'Settings' } ).click();
		await expect( page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Icon Settings' } ).isVisible() ).toBeTruthy();

		// await page.screenshot({ path: 'tests/playwright-screenshot.png' });

		if ( await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Icon Settings' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Icon Settings', expanded: false } ).click();
		}
		await page.waitForTimeout(3000);

		const panelBody = await page.getByRole( 'tabpanel' ).getByRole( 'button', { name: 'Icon settings' } ).locator( '../..' );
		await panelBody.getByRole( 'button', { name: '3' } ).click();

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

		// color
		await panelBody.locator( '.components-circular-option-picker' ).getByLabel( 'Color: Primary' ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33","iconColor":"#9DFF20"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;;--editor-bridge-icon-color:#9DFF20" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

		// ColorPicker
		await page.locator( '.components-color-palette__custom-color-wrapper' ).getByRole( 'button', { name: 'Custom color picker.' } ).click();

		await page.waitForTimeout(3000);
		const saturationTextRect = await page.locator( '.react-colorful__saturation' ).getByRole( 'slider', { name: 'Color' } ).boundingBox();
		await page.locator( '.react-colorful__saturation' ).getByRole( 'slider', { name: 'Color' } ).click({
			position: { x: Number( saturationTextRect.width ) * 0.2, y: Number( saturationTextRect.height ) * 0.2 },
		});

		const hueTextRect = await page.locator( '.react-colorful__hue' ).getByRole( 'slider', { name: 'Hue' } ).boundingBox();
		await page.locator( '.react-colorful__hue' ).getByRole( 'slider', { name: 'Hue' } ).click({
			position: { x: hueTextRect.width * 0.2, y: hueTextRect.height * 0.5 },
		});

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33","iconColor":"#c4cca4"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;;--editor-bridge-icon-color:#c4cca4" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

		// DnD
		const pointerTextSource = await page.locator( '.react-colorful__saturation-pointer' );
		const pointerTextTarget = await page.locator( '.react-colorful__saturation' );
		await pointerTextSource.dragTo( pointerTextTarget, {
			targetPosition: { x: Number( saturationTextRect.width ) * 0.4, y: Number( saturationTextRect.height ) * 0.4 },
		});
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33","iconColor":"#8e995f"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;;--editor-bridge-icon-color:#8e995f" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

		await page.getByLabel( 'Color format' ).selectOption( 'Hex' );
		await page.getByLabel( 'Hex color', { exact: true } ).fill( '#cccccc' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33","iconColor":"#cccccc"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;;--editor-bridge-icon-color:#cccccc" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

		await page.getByLabel( 'Color format' ).selectOption( 'HSL' );
		await page.getByRole( 'spinbutton', { name: 'Hue', exact: true } ).fill( '20' );
		await page.getByRole( 'spinbutton', { name: 'Saturation', exact: true } ).fill( '20' );
		await page.getByRole( 'spinbutton', { name: 'Lightness', exact: true } ).fill( '20' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33","iconColor":"#3d3029"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;;--editor-bridge-icon-color:#3d3029" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

		await page.getByLabel( 'Color format' ).selectOption( 'RGB' );
		await page.getByRole( 'spinbutton', { name: 'Red', exact: true } ).fill( '50' );
		await page.getByRole( 'spinbutton', { name: 'Green', exact: true } ).fill( '100' );
		await page.getByRole( 'spinbutton', { name: 'Blue', exact: true } ).fill( '200' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:list {"className":"is-style-icon","iconUnicode":"33","iconColor":"#3264c8"} -->
<ul style="--editor-bridge-icon-unicode:&quot;\\33&quot;;--editor-bridge-icon-color:#3264c8" class="wp-block-list is-style-icon"><!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>test</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`
		);

	} );

} );
