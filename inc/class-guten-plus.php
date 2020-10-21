<?php
/**
 * Guten_Plus class
 *
 * @package Guten_Plus
 *
 * @since 1.0.0
 */

namespace Guten_Plus;

/**
 * Core class Guten_Plus
 *
 * @since 1.0.0
 */
class Guten_Plus {
	public function __construct() {
		add_action( 'plugins_loaded', [ $this, 'init' ] );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueue_block_asset_styles' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_blocks_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_styles' ] );
	}

	/**
	 * Load textdomain
	 *
	 * @access public
	 *
	 * @return void
	 *
	 * @since 1.0.0
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'guten-plus',
			false,
			GUTEN_PLUS_PATH . '/languages/'
		);
	}

	/**
	 * Load block editor translations
	 *
	 * @access public
	 *
	 * @return void
	 *
	 * @since 1.0.0
	 */
	public function set_block_editor_translations() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				'guten-plus-script',
				'guten-plus',
				GUTEN_PLUS_PATH . '/languages'
			);
		}
	}

	public function enqueue_blocks_scripts() {
		$asset_file = include( GUTEN_PLUS_PATH . 'dist/js/blocks.asset.php' );

		wp_enqueue_script(
			'guten-plus-script',
			plugins_url( 'dist/js/blocks.js', GUTEN_PLUS ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

	public function enqueue_block_editor_styles() {
		wp_enqueue_style(
			'guten-plus-block-editor',
			plugins_url( 'dist/css/block-editor-style.min.css', GUTEN_PLUS ),
			[],
			'20200904',
			'all'
		);

		// $styles = wp_get_custom_css();
		// if ( isset( $styles ) ) {
		// 	$styles = '/* Insert custom css */' . $styles;
		// 	wp_add_inline_style( 'guten-plus-block-asset', $styles );
		// }
	}

	public function enqueue_styles() {
		wp_enqueue_style(
			'guten-plus',
			plugins_url( 'dist/css/blocks.min.css', GUTEN_PLUS ),
			[],
			'20200904',
			'all'
		);
	}

	public function enqueue_block_asset_styles() {
		wp_enqueue_style(
			'guten-plus-block-asset',
			plugins_url( 'dist/css/block-asset.min.css', GUTEN_PLUS ),
			[],
			'20200922',
			'all'
		);
	}

	public function init() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		add_action( 'init', [ $this, 'load_textdomain' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'set_block_editor_translations' ] );

	}
}
