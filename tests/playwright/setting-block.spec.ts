/**
 * WordPress dependencies1
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { dummyText } from './utils/utils';

test.describe( '@default-editor setting block', () => {
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
			.locator( '.edit-post-welcome-guide[role="dialog"][aria-label="Welcome to the block editor"]' )
			.isVisible();
		if ( isVisibleModal ) {
			await page
				.locator( 'button[aria-label="Close"]' )
				.click();
		}

		expect(
			page.locator( '.components-modal__frame[role="dialog"][aria-label="Welcome to the block editor"]' )
		).not.toBeVisible();
	} );

	test.afterEach( async ({ page }, testInfo ) => {
		// delete uploaded image
		if ( testInfo.titlePath.includes( 'toolbar' ) ) {
			await page.goto( '/wp-admin/upload.php' );
			await page.waitForLoadState();

			await page
				.locator( '.attachments' )
				.getByLabel( 'sample', { exact: true } )
				.click();
			page.once( 'dialog', async dialog => {
				console.log( `Dialog message: ${dialog.message()}` );
				await dialog.accept();
			});
			await page
				.locator( '.attachment-info' )
				.getByRole( 'button', { name: 'Delete permanently' } )
				.click();
		}
	} );

	test( 'insert block', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );
		await page.keyboard.press( 'Enter' );

		await page.keyboard.type( dummyText );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

	} );

	test( 'default panel / text', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		// Text
		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Text styles' } )
			.click();

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Vivid red' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-red"}}}},"textColor":"vivid-red"} -->
<p class="has-vivid-red-color has-text-color has-link-color">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Vivid red' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Vivid red' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Vivid red' } )
			.click();
		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Text' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		// ColorPicker
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Text styles' } )
			.click();
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();

		await page.waitForTimeout(1000);
		const saturationTextRect = await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.click({
				position: {
					x: Number( saturationTextRect.width ) * 0.2,
					y: Number( saturationTextRect.height ) * 0.2
				},
			}
		);

		const hueTextRect = await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.click({
				position: {
					x: hueTextRect.width * 0.2,
					y: hueTextRect.height * 0.5
				},
		});

		const alphaTextRect = await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.click({
				position: {
					x: alphaTextRect.width * 0.2,
					y: alphaTextRect.height * 0.5
				},
			});

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"text":"#c4cca333"},"elements":{"link":{"color":{"text":"#c4cca333"}}}}} -->
<p class="has-text-color has-link-color" style="color:#c4cca333">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// DnD
		const pointerTextSource = await page.locator( '.react-colorful__saturation-pointer' );
		const pointerTextTarget = await page.locator( '.react-colorful__saturation' );
		await pointerTextSource.dragTo( pointerTextTarget, {
			targetPosition: {
				x: Number( saturationTextRect.width ) * 0.4,
				y: Number( saturationTextRect.height ) * 0.4
			},
		});
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"text":"#8e995f33"},"elements":{"link":{"color":{"text":"#8e995f33"}}}}} -->
<p class="has-text-color has-link-color" style="color:#8e995f33">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'Hex' );
		await page
			.getByLabel( 'Hex color', { exact: true } )
			.fill( '#cccccc' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"text":"#cccccc"},"elements":{"link":{"color":{"text":"#cccccc"}}}}} -->
<p class="has-text-color has-link-color" style="color:#cccccc">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'HSL' );
		await page
			.getByRole( 'spinbutton', { name: 'Hue', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Saturation', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Lightness', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Alpha', exact: true } )
			.fill( '20' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"text":"#3d302933"},"elements":{"link":{"color":{"text":"#3d302933"}}}}} -->
<p class="has-text-color has-link-color" style="color:#3d302933">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'RGB' );
		await page
			.getByRole( 'spinbutton', { name: 'Red', exact: true } )
			.fill( '50' );
		await page
			.getByRole( 'spinbutton', { name: 'Green', exact: true } )
			.fill( '100' );
		await page
			.getByRole( 'spinbutton', { name: 'Blue', exact: true } )
			.fill( '200' );
		await page
			.getByRole( 'spinbutton', { name: 'Alpha', exact: true } )
			.fill( '80' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"text":"#3264c8cc"},"elements":{"link":{"color":{"text":"#3264c8cc"}}}}} -->
<p class="has-text-color has-link-color" style="color:#3264c8cc">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Text' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

	} );

	test( 'default panel / background', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		// Background
		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();
		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Background styles' } )
			.click();

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Pale pink' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Pale pink' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Pale pink' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Pale pink' } )
			.click();
		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Background' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		// ColorPicker
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Background styles' } )
			.click();
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();

		await page.waitForTimeout(1000);
		const saturationBackgroundRect = await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.click({
				position: {
					x: Number( saturationBackgroundRect.width ) * 0.2,
					y: Number( saturationBackgroundRect.height ) * 0.2
				},
		});

		const hueBackgroundRect = await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.click({
				position: {
					x: hueBackgroundRect.width * 0.2,
					y: hueBackgroundRect.height * 0.5
				},
		});

		const alphaBackgroundRect = await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.click({
				position: {
					x: alphaBackgroundRect.width * 0.2,
					y: alphaBackgroundRect.height * 0.5
				},
			});

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"background":"#c4cca333"}}} -->
<p class="has-background" style="background-color:#c4cca333">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// DnD
		const pointerBackgroundSource = await page.locator( '.react-colorful__saturation-pointer' );
		const pointerBackgroundTarget = await page.locator( '.react-colorful__saturation' );
		await pointerBackgroundSource.dragTo( pointerBackgroundTarget, {
			targetPosition: {
				x: Number( saturationBackgroundRect.width ) * 0.4,
				y: Number( saturationBackgroundRect.height ) * 0.4
			},
		});
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"background":"#8e995f33"}}} -->
<p class="has-background" style="background-color:#8e995f33">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'Hex' );
		await page
			.getByLabel( 'Hex color', { exact: true } )
			.fill( '#cccccc' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"background":"#cccccc"}}} -->
<p class="has-background" style="background-color:#cccccc">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'HSL' );
		await page
			.getByRole( 'spinbutton', { name: 'Hue', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Saturation', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Lightness', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Alpha', exact: true } )
			.fill( '20' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"background":"#3d302933"}}} -->
<p class="has-background" style="background-color:#3d302933">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'RGB' );
		await page
			.getByRole( 'spinbutton', { name: 'Red', exact: true } )
			.fill( '50' );
		await page
			.getByRole( 'spinbutton', { name: 'Green', exact: true } )
			.fill( '100' );
		await page
			.getByRole( 'spinbutton', { name: 'Blue', exact: true } )
			.fill( '200' );
		await page
			.getByRole( 'spinbutton', { name: 'Alpha', exact: true } )
			.fill( '80' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"background":"#3264c8cc"}}} -->
<p class="has-background" style="background-color:#3264c8cc">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// await page
			// .locator( '.components-circular-option-picker__custom-clear-wrapper' )
			// .getByRole( 'button', { name: 'Clear' } )
			// .click();
		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Background' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();
	} );

	test( 'default panel / gradient background', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		// Gradient
		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Background styles' } )
			.click();
		await page
			.locator( '.block-editor-panel-color-gradient-settings__dropdown-content' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Gradient' } )
			.click();
		// await page.locator( '.block-editor-panel-color-gradient-settings__dropdown-content' ).getByRole( 'tablist' ).getByRole( 'tab', { name: 'Solid' } ).click();

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Gradient: Luminous vivid orange to vivid red' )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"gradient":"luminous-vivid-orange-to-vivid-red"} -->
<p class="has-luminous-vivid-orange-to-vivid-red-gradient-background has-background">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Gradient: Luminous vivid orange to vivid red' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Gradient: Luminous vivid orange to vivid red' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Gradient: Luminous vivid orange to vivid red' } )
			.click();
		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Background' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Background styles' } )
			.click();
		await page
			.locator( '.block-editor-panel-color-gradient-settings__dropdown-content' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Gradient' } )
			.click();

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Gradient: Luminous vivid orange to vivid red' )
			.click();
		await page
			.locator( '.components-custom-gradient-picker__ui-line' )
			.getByLabel( 'Type' )
			.selectOption( 'radial-gradient' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"radial-gradient(rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)"}}} -->
<p class="has-background" style="background:radial-gradient(rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.components-custom-gradient-picker__ui-line' )
			.getByLabel( 'Type' )
			.selectOption( 'linear-gradient' );
		await page
			.locator( '.components-custom-gradient-picker__ui-line' )
			.getByLabel( 'Angle' )
			.fill( '60' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(60deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(60deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// angle-circle-indicator
		const angleCircleRect = await page
			.locator( '.components-angle-picker-control__angle-circle' )
			.boundingBox();
		const angleCircleSource = await page.locator( '.components-angle-picker-control__angle-circle-indicator' );
		const angleCircleTarget = await page.locator( '.components-angle-picker-control__angle-circle' );
		await angleCircleSource.dragTo( angleCircleTarget, {
			targetPosition: {
				x: Number( angleCircleRect.width ) * 0.5 - 1,
				y: Number( angleCircleRect.height ) * 0 + 1
			},
		});
		await page.waitForTimeout(1000);
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(0deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(0deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Background' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		// ColorPicker
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Background styles' } )
			.click();
		await page
			.locator( '.block-editor-panel-color-gradient-settings__dropdown-content' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Gradient' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Gradient: Luminous vivid amber to luminous vivid orange' } )
			.click();

		// palette
		await page
			.getByLabel( /Gradient control point at position/ )
			.first()
			.click();
		await page.waitForTimeout(1000);
		const saturationGradientFirestRect = await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.click({
				position: {
					x: Number( saturationGradientFirestRect.width ) * 0.2,
					y: Number( saturationGradientFirestRect.height ) * 0.2
				},
			});

		const hueGradientFirestRect = await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.click({
				position: {
					x: hueGradientFirestRect.width * 0.2,
					y: hueGradientFirestRect.height * 0.5
				},
			});

		const alphaGradientFirestRect = await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.click({
				position: {
					x: alphaGradientFirestRect.width * 0.2,
					y: alphaGradientFirestRect.height * 0.5
				},
			});

		await page
			.getByLabel( /Gradient control point at position/ )
			.last()
			.click();
		await page.waitForTimeout(1000);

		const saturationGradientLastRect = await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__saturation' )
			.getByRole( 'slider', { name: 'Color' } )
			.click({
				position: {
					x: Number( saturationGradientLastRect.width ) * 0.8,
					y: Number( saturationGradientLastRect.height ) * 0.2
				},
			});

		const hueGradientLastRect = await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__hue' )
			.getByRole( 'slider', { name: 'Hue' } )
			.click({
				position: {
					x: hueGradientLastRect.width * 0.8,
					y: hueGradientLastRect.height * 0.8
				},
			});

		const alphaGradientLastRect = await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.boundingBox();
		await page
			.locator( '.react-colorful__alpha' )
			.getByRole( 'slider', { name: 'Alpha' } )
			.click({
				position: {
					x: alphaGradientLastRect.width * 0.8,
					y: alphaGradientLastRect.height * 0.8
				},
			});

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(196,204,163,0.2) 0%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(196,204,163,0.2) 0%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.block-editor-color-gradient-control__panel' )
			.click();
		await page
			.getByLabel( /Gradient control point at position/ )
			.first()
			.click();
		await page.waitForTimeout(1000);

		// DnD
		const pointerGradientSource = await page.locator( '.react-colorful__saturation-pointer' );
		const pointerGradientTarget = await page.locator( '.react-colorful__saturation' );
		await pointerGradientSource.dragTo( pointerGradientTarget, {
			targetPosition: {
				x: Number( saturationGradientFirestRect.width ) * 0.4,
				y: Number( saturationGradientFirestRect.height ) * 0.4
			},
		});
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(142,153,95,0.2) 0%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(142,153,95,0.2) 0%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'Hex' );
		await page
			.getByLabel( 'Hex color', { exact: true } )
			.fill( '#cccccc' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgb(204,204,204) 0%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgb(204,204,204) 0%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'HSL' );
		await page
			.getByRole( 'spinbutton', { name: 'Hue', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Saturation', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Lightness', exact: true } )
			.fill( '20' );
		await page
			.getByRole( 'spinbutton', { name: 'Alpha', exact: true } )
			.fill( '20' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(61,48,41,0.2) 0%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(61,48,41,0.2) 0%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Color format' )
			.selectOption( 'RGB' );
		await page
			.getByRole( 'spinbutton', { name: 'Red', exact: true } )
			.fill( '50' );
		await page
			.getByRole( 'spinbutton', { name: 'Green', exact: true } )
			.fill( '100' );
		await page
			.getByRole( 'spinbutton', { name: 'Blue', exact: true } )
			.fill( '200' );
		await page
			.getByRole( 'spinbutton', { name: 'Alpha', exact: true } )
			.fill( '80' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(50,100,200,0.8) 0%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(50,100,200,0.8) 0%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.block-editor-color-gradient-control__panel' )
			.click();
		const gradientPickerRect = await page
			.locator( '.components-custom-gradient-picker__markers-container' )
			.boundingBox();
		const slideTarget = gradientPickerRect.x + gradientPickerRect.width / 2;

		// add gradient point
		// linear-color-stop is 50%
		await page.mouse.click(
			slideTarget,
			gradientPickerRect.y + 20
		);

		await page
			.locator( '.components-custom-gradient-picker__insert-point-dropdown' )
			.click();
		await page
			.getByLabel( 'Color format' )
			.selectOption( 'Hex' );
		await page
		.getByLabel( 'Hex color', { exact: true } )
		.fill( '#da0c0c' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(50,100,200,0.8) 0%,rgb(218,12,12) 50%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(50,100,200,0.8) 0%,rgb(218,12,12) 50%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// remove point
		await page
			.locator( '.block-editor-color-gradient-control__panel' )
			.click();
		await page
			.getByLabel( /Gradient control point at position/ )
			.nth(1)
			.click();
		await page
			.locator( '.components-color-palette__custom-color-dropdown-content' )
			.scrollIntoViewIfNeeded();
		await page
			.locator( '.components-color-palette__custom-color-dropdown-content' )
			.getByRole( 'button', { name: 'Remove Control Point' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(50,100,200,0.8) 0%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(50,100,200,0.8) 0%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// slide point
		// linear-color-stop is 50%
		await page
			.locator( '.block-editor-color-gradient-control__panel' )
			.click();
		const gradientPickerPointRect = await page
			.getByLabel( /Gradient control point at position/ )
			.first()
			.boundingBox();
		await page
			.getByLabel( /Gradient control point at position/ )
			.first()
			.hover();

		await page.mouse.down();
		await page.mouse.move(
			slideTarget,
			gradientPickerPointRect.y + 24
		);
		await page.mouse.up();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"color":{"gradient":"linear-gradient(135deg,rgba(50,100,200,0.8) 50%,rgba(166,41,204,0.8) 100%)"}}} -->
<p class="has-background" style="background:linear-gradient(135deg,rgba(50,100,200,0.8) 50%,rgba(166,41,204,0.8) 100%)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitem', { name: 'Reset Background' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();
	} );

	test( 'default panel / typography', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.typography-block-support-panel' )
			.getByLabel ( 'Large', { exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.typography-block-support-panel' )
			.getByRole( 'button', { name: 'Set custom size' } )
			.click();
		await page
			.locator( '.typography-block-support-panel' )
			.getByLabel ( 'Custom', { exact: true } )
			.fill( '4' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"fontSize":"4rem"}}} -->
<p style="font-size:4rem">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Custom', { exact: true } )
			.locator( '../..' )
			.getByLabel( 'Select unit' )
			.selectOption( 'px' );
		await page
			.locator( '.typography-block-support-panel' )
			.getByLabel ( 'Custom', { exact: true } )
			.fill( '24' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"fontSize":"24px"}}} -->
<p style="font-size:24px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

	} );

	test( 'support panel', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();

		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Show Link' } )
			.click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await page
			.locator( '.typography-block-support-panel' )
			.getByRole( 'button', { name: 'Typography options' } )
			.click();

		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Font' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Appearance' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Line height' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Letter spacing' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Decoration' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Letter case' } )
			.click();

		// TODO: Reset all
		// await page.getByRole( 'menu', { name: 'Typography options' } ).getByRole( 'menuitem', { name: 'Reset all' } ).click();
		// await page.getByRole( 'menu', { name: 'Typography options' } ).getByRole( 'menuitem', { name: 'Reset Font size' } ).click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Dimensions options' } )
			.click();

		await page
			.getByRole( 'menu', { name: 'Dimensions options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Padding' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Dimensions options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Margin' } )
			.click();

		// await page.getByRole( 'menu', { name: 'Dimensions options' } ).getByRole( 'menuitem', { name: 'Reset all' } ).click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();
		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Settings' } )
			.click();

		if ( await page.getByRole( 'button', { name: 'Advanced' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page
				.getByRole( 'button', { name: 'Advanced', expanded: false } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

	} );

	test( 'color panel', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		// set link via toolbar
		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.selectText();
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'Link', { exact: true } )
			.click();
		await page
			.getByPlaceholder( 'Search or type url' )
			.fill( 'test.html' );
		await page
			.getByRole( 'option', { name: 'test.html Press ENTER to add this link link' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p><a href="http://test.html" data-type="link" data-id="test.html">${dummyText}</a></p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.color-block-support-panel' )
			.getByRole( 'button', { name: 'Color options' } )
			.click();

		await page
			.getByRole( 'menu', { name: 'Color options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Show Link' } )
			.click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await expect(
			page
				.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
				.getByRole( 'button', { name: 'Color Link styles' } )
				.getByLabel( 'Link' )
				.isVisible()
		).toBeTruthy();

		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Link styles' } )
			.click();

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Vivid cyan blue' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-cyan-blue"}}}}} -->
<p class="has-link-color"><a href="http://test.html" data-type="link" data-id="test.html">${dummyText}</a></p>
<!-- /wp:paragraph -->`
		);

		// await page.locator( '.block-editor-panel-color-gradient-settings__dropdown-content' ).getByRole( 'tablist' ).getByRole( 'tab', { name: 'Default' } ).click();
		await page
			.locator( '.block-editor-panel-color-gradient-settings__dropdown-content' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Hover' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Vivid red' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|vivid-cyan-blue"},":hover":{"color":{"text":"var:preset|color|vivid-red"}}}}}} -->
<p class="has-link-color"><a href="http://test.html" data-type="link" data-id="test.html">${dummyText}</a></p>
<!-- /wp:paragraph -->`
		);

		// TODO: check hover color
		// await editor.canvas.locator( 'p[data-type="core/paragraph"]' ).click({ position: { x: 300, y: 0 } });
		// await editor.canvas.locator( 'p[data-type="core/paragraph"]' ).hover({ position: { x: 300, y: 10 } });

		// await page.getByRole( 'menu', { name: 'Color options' } ).getByRole( 'menuitem', { name: 'Reset all' } ).click();

	} );

	test( 'typography panel', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.typography-block-support-panel' )
			.getByRole( 'button', { name: 'Typography options' } )
			.click();
		// await page.getByRole( 'menu', { name: 'Typography options' } ).getByRole( 'menuitem', { name: 'Reset Font size' } ).click();

		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Font' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Appearance' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Line height' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Letter spacing' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Decoration' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Typography options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Letter case' } )
			.click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await expect(
			page
				.locator( '.typography-block-support-panel' )
				.getByText( 'Font', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.typography-block-support-panel' )
				.getByText( 'Appearance', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.typography-block-support-panel' )
				.getByText( 'Line height', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.typography-block-support-panel' )
				.getByText( 'Letter spacing', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.typography-block-support-panel' )
				.getByText( 'Decoration', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.typography-block-support-panel' )
				.getByText( 'Letter case', { exact: true } )
				.isVisible()
		).toBeTruthy();

		await page
			.getByLabel( 'Font', { exact: true } )
			.selectOption( '"Source Serif Pro", serif' );

		// TODO: Appearance、プレビューエラーになる、バグの可能性?
// 		await page.getByRole( 'button', { name: 'Appearance' } ).click();
// 		await page.getByRole( 'option', { name: 'Bold', exact: true } ).click();
// 		await page.getByRole( 'listbox' ).getByRole( 'option', { name: 'Bold', exact: true } ).click();
// 		await expect( await editor.getEditedPostContent() ).toBe(
// 			`<!-- wp:paragraph {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}},"fontFamily":"source-serif-pro"} -->
// <p class="has-source-serif-pro-font-family" style="font-style:normal;font-weight:700">${dummyText}</p>
// <!-- /wp:paragraph -->`
// 		);

		// await editor.canvas
			// .locator( 'p[data-type="core/paragraph"]' )
			// .click();

		await page
			.getByLabel( 'Line height', { exact: true } )
			.fill( '1.9' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="line-height:1.9">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( 'body' )
			.click();
		await page
			.locator( '.block-editor-line-height-control' )
			.getByLabel( 'Increment' )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"2"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="line-height:2">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.block-editor-line-height-control' )
			.getByLabel( 'Decrement' )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="line-height:1.9">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Letter spacing', { exact: true } )
			.fill( '4' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9","letterSpacing":"4px"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="letter-spacing:4px;line-height:1.9">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByLabel( 'Letter spacing', { exact: true } )
			.locator( '../..' )
			.getByLabel( 'Select unit' )
			.selectOption( 'rem' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9","letterSpacing":"4rem"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="letter-spacing:4rem;line-height:1.9">${dummyText}</p>
<!-- /wp:paragraph -->`
		);
		await page
			.getByLabel( 'Letter spacing', { exact: true } )
			.locator( '../..' )
			.getByLabel( 'Select unit' )
			.selectOption( 'px' );

		// await page.getByRole( 'group', { name: 'Decoration' } ).getByLabel( 'None' ).click();
		await page
			.getByRole( 'group', { name: 'Decoration' } )
			.getByLabel( 'Underline' )
			.click();
		// await page.getByRole( 'group', { name: 'Decoration' } ).getByLabel( 'Strikethrough ').click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9","letterSpacing":"4px","textDecoration":"underline"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="letter-spacing:4px;line-height:1.9;text-decoration:underline">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByRole( 'group', { name: 'Decoration' } )
			.getByLabel( 'Underline' )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9","letterSpacing":"4px"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="letter-spacing:4px;line-height:1.9">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		// await page.getByRole('group', { name: 'Letter case' }).getByLabel( 'None' ).click();
		await page
			.getByRole( 'group', { name: 'Letter case' } )
			.getByLabel( 'Uppercase' )
			.click();
		// await page.getByRole( 'group', { name: 'Letter case' } ).getByLabel( 'Lowercase' ).click();
		// await page.getByRole( 'group', { name: 'Letter case' } ).getByLabel( 'Capitalize' ).click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9","letterSpacing":"4px","textTransform":"uppercase"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="letter-spacing:4px;line-height:1.9;text-transform:uppercase">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.getByRole( 'group', { name: 'Letter case' } )
			.getByLabel( 'Uppercase' )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9","letterSpacing":"4px"}},"fontFamily":"source-serif-pro"} -->
<p class="has-source-serif-pro-font-family" style="letter-spacing:4px;line-height:1.9">${dummyText}</p>
<!-- /wp:paragraph -->`
			);

		// await page.getByRole( 'menu', { name: 'Typography options' } ).getByRole( 'menuitem', { name: 'Reset all' } ).click();

	} );

	test( 'dimensions panel', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await page
			.getByLabel( 'Editor settings' )
			.locator( '.block-editor-block-inspector__tabs' )
			.getByRole( 'tab', { name: 'Styles' } )
			.click();
		await page
			.locator( '.color-block-support-panel > .color-block-support-panel__inner-wrapper' )
			.getByRole( 'button', { name: 'Color Background styles' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByRole( 'option', { name: 'Color: Pale pink' } )
			.click();

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Dimensions options' } )
			.click();

		await page
			.getByRole( 'menu', { name: 'Dimensions options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Padding' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Dimensions options' } )
			.getByRole( 'menuitemcheckbox', { name: 'Margin' } )
			.click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await expect(
			page
				.locator( '.dimensions-block-support-panel' )
				.getByText( 'Padding', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.dimensions-block-support-panel' )
				.getByText( 'Margin', { exact: true } )
				.isVisible()
		).toBeTruthy();

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(0)
			.fill( '2' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(1)
			.fill( '4' );
		// await page.locator( '#inspector-range-control-0' ).fill( '2' );
		// await page.locator( '#inspector-range-control-1' ).fill( '4' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--60)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(0)
			.locator( '../../../../..' )
			.getByLabel( 'Set custom size' )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(0)
			.fill( '12' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"12px","bottom":"12px","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="padding-top:12px;padding-right:var(--wp--preset--spacing--60);padding-bottom:12px;padding-left:var(--wp--preset--spacing--60)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(0)
			.locator( '../..' )
			.getByLabel( 'Select unit' )
			.selectOption( 'rem' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"12rem","bottom":"12rem","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="padding-top:12rem;padding-right:var(--wp--preset--spacing--60);padding-bottom:12rem;padding-left:var(--wp--preset--spacing--60)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(0)
			.locator( '../../../../..' )
			.getByLabel( 'Use size preset' )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'padding', { exact: true } )
			.nth(0)
			.fill( '2' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--60)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'margin', { exact: true } )
			.nth(0)
			.fill( '2' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'margin', { exact: true } )
			.nth(1)
			.fill( '4' );
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"},"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);margin-right:var(--wp--preset--spacing--60);margin-bottom:var(--wp--preset--spacing--40);margin-left:var(--wp--preset--spacing--60);padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--60)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Padding options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Padding options' } )
			.getByRole( 'menuitemradio', { name: 'Top' } )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Top padding', { exact: true } )
			.fill( '3' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Padding options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Padding options' } )
			.getByRole( 'menuitemradio', { name: 'Right' } )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Right padding', { exact: true } )
			.fill( '3' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Padding options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Padding options' } )
			.getByRole( 'menuitemradio', { name: 'Left' } )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Left padding', { exact: true } )
			.fill( '3' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Padding options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Padding options' } )
			.getByRole( 'menuitemradio', { name: 'Bottom' } )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Bottom padding', { exact: true } )
			.fill( '3' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);margin-right:var(--wp--preset--spacing--60);margin-bottom:var(--wp--preset--spacing--40);margin-left:var(--wp--preset--spacing--60);padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Padding options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Padding options' } )
			.getByRole( 'menuitemradio', { name: 'Custom' } )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Top padding', { exact: true } )
			.fill( '5' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Right padding', { exact: true } )
			.fill( '5' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Left padding', { exact: true } )
			.fill( '5' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Bottom padding', { exact: true } )
			.fill( '5' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|70","right":"var:preset|spacing|70"},"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);margin-right:var(--wp--preset--spacing--60);margin-bottom:var(--wp--preset--spacing--40);margin-left:var(--wp--preset--spacing--60);padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--70)">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Top padding', { exact: true } )
			.locator( '../../../../..' )
			.getByLabel( 'Set custom size' )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Right padding', { exact: true } )
			.locator( '../../../../..' )
			.getByLabel( 'Set custom size' )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Left padding', { exact: true } )
			.locator( '../../../../..' )
			.getByLabel( 'Set custom size' )
			.click();
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Bottom padding', { exact: true } )
			.locator( '../../../../..' )
			.getByLabel( 'Set custom size' )
			.click();

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Top padding', { exact: true } )
			.fill( '24' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Right padding', { exact: true } )
			.fill( '24' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Left padding', { exact: true } )
			.fill( '24' );
		await page
			.locator( '.dimensions-block-support-panel' )
			.getByLabel( 'Bottom padding', { exact: true } )
			.fill( '24' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"style":{"spacing":{"padding":{"top":"24px","bottom":"24px","left":"24px","right":"24px"},"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"pale-pink"} -->
<p class="has-pale-pink-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);margin-right:var(--wp--preset--spacing--60);margin-bottom:var(--wp--preset--spacing--40);margin-left:var(--wp--preset--spacing--60);padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">${dummyText}</p>
<!-- /wp:paragraph -->`
		);

		await page
			.locator( '.dimensions-block-support-panel' )
			.getByRole( 'button', { name: 'Padding options' } )
			.click();
		await page
			.getByRole( 'menu', { name: 'Padding options' } )
			.getByRole( 'menuitemradio', { name: 'Horizontal & vertical' } )
			.click();

		// await page.locator( '.dimensions-block-support-panel' ).getByRole( 'button', { name: 'Margin options' } ).click();

		// await page.getByRole( 'menu', { name: 'Typography options' } ).getByRole( 'menuitem', { name: 'Reset all' } ).click();

	} );

	test( 'advanced panel', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		if ( await page.getByRole( 'button', { name: 'Advanced' } ).getAttribute( 'aria-expanded' ) == 'false' ) {
			await page
				.getByRole( 'button', { name: 'Advanced', expanded: false } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await expect(
			page
				.locator( '.block-editor-block-inspector__advanced' )
				.getByText( 'HTML anchor', { exact: true } )
				.isVisible()
		).toBeTruthy();
		await expect(
			page
				.locator( '.block-editor-block-inspector__advanced' )
				.getByText( 'Additional CSS class(es)', { exact: true } )
				.isVisible()
		).toBeTruthy();

		await page
			.getByLabel( 'HTML anchor' )
			.click();
		await page
			.getByLabel( 'HTML anchor' )
			.fill( 'abc' );
		await page
			.getByLabel( 'Additional CSS class(es)' )
			.click();
		await page
			.getByLabel( 'Additional CSS class(es)' )
			.fill( 'test' );

		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph {"className":"test"} -->
<p class="test" id="abc">${dummyText}</p>
<!-- /wp:paragraph -->`
		);
	} );

	test( 'toolbar', async ({ editor, page }) => {
		await editor.canvas
			.getByRole( 'textbox', { name: 'Add title' } )
			.fill( 'test' );

		await editor.canvas
			.locator( '.block-editor-default-block-appender' )
			.getByRole( 'button', { name: 'Add default block' } )
			.click();
		await page.keyboard.type( dummyText );

		if ( ! await page.getByLabel( 'Editor settings' ).isVisible() ) {
			await page
				.getByLabel( 'Editor top bar' )
				.getByRole( 'button', { name: 'Settings' } )
				.click();
		}

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.click();

		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.selectText();
		await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.press( 'ArrowLeft' );

		for ( const i in Array(6).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(5).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Link
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'Link', { exact: true } )
			.click();
		await page
			.getByPlaceholder( 'Search or type url' )
			.fill( 'test.html' );
		await page
			.getByRole( 'option', { name: 'test.html Press ENTER to add this link link' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<a href="http://test.html" data-type="link" data-id="test.html">ipsum</a>'
		);

		for ( const i in Array(2).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(5).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Bold
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'Bold', { exact: true } )
			.click();

		// await page.screenshot({ path: 'tests/playwright-screenshot.png' });

		await expect( await editor.getEditedPostContent() ).toContain(
			'<strong>dolor</strong>'
		);

		for ( const i in Array(6).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(4).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Italic
		await page.getByLabel( 'Block tools' )
			.getByLabel( 'Italic', { exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<em>amet</em>'
		);

		for ( const i in Array(3).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(11).fill(0) ) {
			await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.press( 'Shift+ArrowRight' );
		}

		// Strikethrough
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Strikethrough' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<s>consectetur</s>'
		);

		for ( const i in Array(2).fill(0) ) {
			await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.press( 'ArrowRight' );
		}
		for ( const i in Array(8).fill(0) ) {
			await editor.canvas
			.locator( 'p[data-type="core/paragraph"]' )
			.press( 'Shift+ArrowRight' );
		}

		// Inline code
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Inline code' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<code>adipisci</code>'
		);

		for ( const i in Array(2).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(4).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Keyboard input
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Keyboard input' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<kbd>elit</kbd>'
		);

		for ( const i in Array(3).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(3).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Subscript
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Subscript' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<sub>sed</sub>'
		);

		for ( const i in Array(2).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(7).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Superscript
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Superscript' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<sup>eiusmod</sup>'
		);

		for ( const i in Array(2).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(6).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Highlight
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Highlight' } )
			.first()
			.click();

		// ColorPicker
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Tertiary' )
			.click();

		await page
			.locator( '.format-library__inline-color-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Background' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Primary' )
			.click();

		await expect( await editor.getEditedPostContent() ).toContain(
			'<mark style="background-color:#9DFF20" class="has-inline-color has-tertiary-color">tempor</mark>'
		);

		// Background custom setting
		await page
			.locator( '.format-library__inline-color-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Text' } )
			.click();
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();
		await page.waitForTimeout(1000);

		{
			const saturationTextRect = await page
				.locator( '.react-colorful__saturation' )
				.getByRole( 'slider', { name: 'Color' } )
				.boundingBox();
			await page
				.locator( '.react-colorful__saturation' )
				.getByRole( 'slider', { name: 'Color' } )
				.click({
						position: {
							x: Number( saturationTextRect.width ) * 0.2,
							y: Number( saturationTextRect.height ) * 0.2
						},
				});
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#9DFF20;color:#cca4a4" class="has-inline-color">tempor</mark>'
			);

			const hueTextRect = await page
				.locator( '.react-colorful__hue' )
				.getByRole( 'slider', { name: 'Hue' } )
				.boundingBox();
			await page
				.locator( '.react-colorful__hue' )
				.getByRole( 'slider', { name: 'Hue' } )
				.click({
					position: {
						x: hueTextRect.width * 0.2,
						y: hueTextRect.height * 0.5
					},
			});
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#9DFF20;color:#c4cca4" class="has-inline-color">tempor</mark>'
			);

			// DnD
			const pointerTextSource = await page.locator( '.react-colorful__saturation-pointer' );
			const pointerTextTarget = await page.locator( '.react-colorful__saturation' );
			await pointerTextSource.dragTo( pointerTextTarget, {
				targetPosition: {
				x: Number( saturationTextRect.width ) * 0.4,
				y: Number( saturationTextRect.height ) * 0.4
			},
			});
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#9DFF20;color:#8e995f" class="has-inline-color">tempor</mark>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'Hex' );
			await page
				.getByLabel( 'Hex color', { exact: true } )
				.fill( '#cccccc' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#9DFF20;color:#cccccc" class="has-inline-color">tempor</mark>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'HSL' );
			await page
				.getByRole( 'spinbutton', { name: 'Hue', exact: true } )
				.fill( '20' );
			await page
				.getByRole( 'spinbutton', { name: 'Saturation', exact: true } )
				.fill( '20' );
			await page
				.getByRole( 'spinbutton', { name: 'Lightness', exact: true } )
				.fill( '20' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#9DFF20;color:#3d3029" class="has-inline-color">tempor</mark>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'RGB' );
			await page
				.getByRole( 'spinbutton', { name: 'Red', exact: true } )
				.fill( '50' );
			await page
				.getByRole( 'spinbutton', { name: 'Green', exact: true } )
				.fill( '100' );
			await page
				.getByRole( 'spinbutton', { name: 'Blue', exact: true } )
				.fill( '200' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#9DFF20;color:#3264c8" class="has-inline-color">tempor</mark>'
			);
		}

		await page.keyboard.press( 'Escape' );
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();
		await page.keyboard.press( 'Escape' );
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<mark style="background-color:#9DFF20" class="has-inline-color">tempor</mark>'
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Tertiary' )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<mark style="background-color:#9DFF20" class="has-inline-color has-tertiary-color">tempor</mark>'
		);

		// background custom setting
		await page
			.locator( '.format-library__inline-color-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Background' } )
			.click();
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();
		await page.waitForTimeout(1000);

		{
			const saturationTextRect = await page
				.locator( '.react-colorful__saturation' )
				.getByRole( 'slider', { name: 'Color' } )
				.boundingBox();
			await page
				.locator( '.react-colorful__saturation' )
				.getByRole( 'slider', { name: 'Color' } )
				.click({
					position: {
						x: Number( saturationTextRect.width ) * 0.2,
						y: Number( saturationTextRect.height ) * 0.2
					},
				});

			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#bbcca4" class="has-inline-color has-tertiary-color">tempor</mark>'
				);

			const hueTextRect = await page
				.locator( '.react-colorful__hue' )
				.getByRole( 'slider', { name: 'Hue' } )
				.boundingBox();
			await page
				.locator( '.react-colorful__hue' )
				.getByRole( 'slider', { name: 'Hue' } )
				.click({
					position: {
						x: hueTextRect.width * 0.2,
						y: hueTextRect.height * 0.5
					},
				});
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#c4cca4" class="has-inline-color has-tertiary-color">tempor</mark>'
			);

			// DnD
			const pointerTextSource = await page.locator( '.react-colorful__saturation-pointer' );
			const pointerTextTarget = await page.locator( '.react-colorful__saturation' );
			await pointerTextSource.dragTo( pointerTextTarget, {
				targetPosition: {
					x: Number( saturationTextRect.width ) * 0.4,
					y: Number( saturationTextRect.height ) * 0.4
				},
			});
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#8e995f" class="has-inline-color has-tertiary-color">tempor</mark>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'Hex' );
			await page
				.getByLabel( 'Hex color', { exact: true } )
				.fill( '#cccccc' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#cccccc" class="has-inline-color has-tertiary-color">tempor</mark>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'HSL' );
			await page
				.getByRole( 'spinbutton', { name: 'Hue', exact: true } )
				.fill( '20' );
			await page
				.getByRole( 'spinbutton', { name: 'Saturation', exact: true } )
				.fill( '20' );
			await page
				.getByRole( 'spinbutton', { name: 'Lightness', exact: true } )
				.fill( '20' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#3d3029" class="has-inline-color has-tertiary-color">tempor</mark>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'RGB' );
			await page
				.getByRole( 'spinbutton', { name: 'Red', exact: true } )
				.fill( '50' );
			await page
				.getByRole( 'spinbutton', { name: 'Green', exact: true } )
				.fill( '100' );
			await page
				.getByRole( 'spinbutton', { name: 'Blue', exact: true } )
				.fill( '200' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<mark style="background-color:#3264c8" class="has-inline-color has-tertiary-color">tempor</mark>'
			);
		}

		await page.keyboard.press( 'Escape' );
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();
		await page.keyboard.press( 'Escape' );
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-tertiary-color">tempor</mark>'
		);


		for ( const i in Array(2).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(8).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Language
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Language' } )
			.click();

		await page
			.locator( '.block-editor-format-toolbar__language-popover' )
			.getByLabel( 'Language' )
			.fill( 'en' );
		await page
			.locator( '.block-editor-format-toolbar__language-popover' )
			.getByLabel( 'Text direction' )
			.selectOption( 'ltr' );
		await page
			.locator( '.block-editor-format-toolbar__language-popover' )
			.getByRole( 'button', { name: 'Apply' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<bdo lang="en" dir="ltr">incidunt</bdo>'
		);

		for ( const i in Array(5).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(6).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Language' } )
			.click();

		await page
			.locator( '.block-editor-format-toolbar__language-popover' )
			.getByLabel( 'Language' )
			.fill( 'fr' );
		await page
			.locator( '.block-editor-format-toolbar__language-popover' )
			.getByLabel( 'Text direction' )
			.selectOption( 'rtl' );
		await page
			.locator( '.block-editor-format-toolbar__language-popover' )
			.getByRole( 'button', { name: 'Apply' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<bdo lang="fr" dir="rtl">labore</bdo>'
		);

		for ( const i in Array(1).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}

		// Inline image
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitem', { name: 'Inline image' } )
			.click();

		const [ fileChooser ] = await Promise.all([
			page.waitForEvent( 'filechooser' ),
			page
				.locator( '.upload-ui' )
				.getByRole( 'button', { name: 'Select Files' } )
				.click(),
		]);

		await fileChooser.setFiles( './tests/playwright/sample.png' );
		await page.waitForTimeout(1000);
		await page
			.locator( '.media-toolbar' )
			.getByRole( 'button', { name: 'Select', exact: true } )
			.click();

		await expect( await editor.getEditedPostContent() ).toMatch(
			/<img class="wp-image-\d+" style="width: 150px;" src="http:\/\/localhost:8080\/wp-content\/uploads\/\d+\/\d+\/sample.png" alt="">/
		);

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();

		for ( const i in Array(3).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'ArrowRight' );
		}
		for ( const i in Array(7).fill(0) ) {
			await editor.canvas
				.locator( 'p[data-type="core/paragraph"]' )
				.press( 'Shift+ArrowRight' );
		}

		// Footnote
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitem', { name: 'Footnote' } )
			.click();
		await page.keyboard.type( 'test' );

		await expect( await editor.getEditedPostContent() ).toMatch(
			/<sup .*class="fn">.*<\/sup>/
		);
		await expect( await editor.getEditedPostContent() ).toContain(
			'<!-- wp:footnotes /-->'
		);

	} );

} );
