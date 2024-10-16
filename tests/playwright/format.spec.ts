/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { sliderRectOffSet, dummyText } from './utils/utils';

test.describe( '@editor-bridge format', () => {
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

	test( 'font-size format', async ( { editor, page } ) => {
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

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Font Size' } )
			.click();

		await page
			.locator( '.components-fontsize-picker' )
			.getByRole( 'radiogroup', { name: 'Font size' } )
			.getByRole( 'radio', { name: 'Large', exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>Lorem <span style="font-size: 1.75rem;" class="editor-bridge-has-font-size">ipsum</span> dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<!-- /wp:paragraph -->`
		);

		await expect( await editor.getEditedPostContent() ).toContain(
			'<span style="font-size: 1.75rem;" class="editor-bridge-has-font-size">ipsum</span>'
		);

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Font Size' } )
			.click();

		await page
			.locator( '.components-fontsize-picker' )
			.getByRole( 'radiogroup', { name: 'Font size' } )
			.getByRole( 'radio', { name: 'Extra Extra Large', exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span style="font-size: 10rem;" class="editor-bridge-has-font-size">ipsum</span>'
		);

		await page
			.locator( '.components-fontsize-picker' )
			.getByLabel( 'Set custom size' )
			.click();

		await page
			.locator( '.components-fontsize-picker' )
			.getByLabel( 'Custom', { exact: true } )
			.fill( '3' );
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span style="font-size: 3rem;" class="editor-bridge-has-font-size">ipsum</span>'
		);

		await page
			.locator( '.components-fontsize-picker' )
			.getByLabel( 'Select unit' )
			.selectOption( 'em' );
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span style="font-size: 3em;" class="editor-bridge-has-font-size">ipsum</span>'
		);

		// Reset
		await page
			.locator( '.components-fontsize-picker' )
			.getByRole( 'button', { name: 'Reset', exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);
	} );

	test( 'badge format', async ( { editor, page } ) => {
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

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Badge' } )
			.click();
		await page.waitForTimeout(1000);

		// ColorPicker
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Secondary' )
			.click();
		await page
			.locator( '.components-inline-badge-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Text' } )
			.click();
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Tertiary' )
			.click();
		await page
			.locator( '.components-inline-badge-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Style' } )
			.click();
		await page
			.locator( '.components-select-control__input' )
			.selectOption( 'round' );
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
		);

		// Background custom setting
		await page
			.locator( '.components-inline-badge-popover' )
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#bbcca4;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#c4cca4;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#8e995f;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'Hex' );
			await page
				.getByLabel( 'Hex color', { exact: true } )
				.fill( '#cccccc' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#cccccc;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#3d3029;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;background-color:#3264c8;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
			);
		}

		// Clear
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Badge' } )
			.click();
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();
		// await page.locator( '.components-inline-badge-popover' ).getByRole( 'tabpanel' ).highlight();
		await page.keyboard.press( 'Escape' );
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#F6F6F6;">ipsum</span>'
		);

		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Secondary' )
			.click();

		// Text custom setting
		await page
			.locator( '.components-inline-badge-popover' )
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#cca4a4;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#c4cca4;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#8e995f;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'Hex' );
			await page
				.getByLabel( 'Hex color', { exact: true } )
				.fill( '#cccccc' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#cccccc;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#3d3029;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
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
				'<span class="editor-bridge-has-badge is-badge-style-round" style="color:#3264c8;background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
			);
		}

		// Clear
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Badge' } )
			.click();
		await page
			.locator( '.components-inline-badge-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Text' } )
			.click();
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
			'<span class="editor-bridge-has-badge is-badge-style-round" style="background-color:#345C00;padding:.2rem .8em;border-radius:2rem;">ipsum</span>'
		);

		// Reset
		await page
			.locator( '.components-inline-badge-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Style' } )
			.click();
		await page
			.locator( '.components-inline-badge-popover' )
			.getByRole( 'tabpanel' )
			.getByRole( 'button', { name: 'Reset', exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);
	} );

	test( 'font-weight format', async ( { editor, page } ) => {
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

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Font Weight' } )
			.click();
		await page.waitForTimeout(1000);

		await page
			.locator( '.components-select-control__input' )
			.selectOption( 'bold' );
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span style="font-weight: bold;" class="editor-bridge-has-font-weight">ipsum</span>'
		);

		// Reset
		await page
			.locator( '.components-inline-fontweight-popover' )
			.getByRole( 'button', { name: 'Reset', exact: true } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);
	} );

	test( 'highlight format', async ( { editor, page } ) => {
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

		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Highlight' } )
			.nth(1)
			.click();
		await page.waitForTimeout(1000);

		// Style
		await page
			.locator( '.components-circular-option-picker__swatches' )
			.getByLabel( 'Color: Secondary' )
			.click();
		await page
			.locator( '.components-inline-highligh-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Style' } )
			.click();
		await page
			.locator( '.components-select-control__input' )
			.selectOption( 'marker' );
		await expect( await editor.getEditedPostContent() ).toContain(
			'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #345c00;">ipsum</span>'
		);

		// Color custom setting
		await page
			.locator( '.components-inline-highligh-popover' )
			.getByRole( 'tablist' )
			.getByRole( 'tab', { name: 'Color' } )
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
				'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #bbcca4;">ipsum</span>'
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
				'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #c4cca4;">ipsum</span>'
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
				'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #8e995f;">ipsum</span>'
			);

			await page
				.getByLabel( 'Color format' )
				.selectOption( 'Hex' );
			await page
				.getByLabel( 'Hex color', { exact: true } )
				.fill( '#cccccc' );
			await expect( await editor.getEditedPostContent() ).toContain(
				'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #cccccc;">ipsum</span>'
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
				'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #3d3029;">ipsum</span>'
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
				'<span class="editor-bridge-has-highlight is-highlight-style-marker" style="background-color: #3264c8;">ipsum</span>'
			);
		}

		// Clear
		await page
			.getByLabel( 'Block tools' )
			.getByLabel( 'More', { exact: true } )
			.click();
		await page
			.getByRole( 'menu', { name: 'More' } )
			.getByRole( 'menuitemcheckbox', { name: 'Highlight' } )
			.nth(1)
			.click();
		await page
			.locator( '.components-color-palette__custom-color-wrapper' )
			.getByRole( 'button', { name: 'Custom color picker.' } )
			.click();
		await page.keyboard.press( 'Escape' );
		await page
			.locator( '.components-circular-option-picker__custom-clear-wrapper' )
			.getByRole( 'button', { name: 'Clear' } )
			.click();
		await expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:paragraph -->
<p>${dummyText}</p>
<!-- /wp:paragraph -->`
		);
	} );

} );
