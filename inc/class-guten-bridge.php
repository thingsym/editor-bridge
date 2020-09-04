<?php
/**
 * Guten_Bridge class
 *
 * @package Guten_Bridge
 *
 * @since 1.0.0
 */

namespace Guten_Bridge;

/**
 * Core class Guten_Bridge
 *
 * @since 1.0.0
 */
class Guten_Bridge {
	public function __construct() {
		add_action( 'init', array( $this, 'load_textdomain' ) );

		add_action( 'enqueue_block_assets', array( $this, 'enqueue_styles' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_blocks_scripts' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_styles' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'load_block_editor_translations' ) );
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
			'guten-bridge',
			false,
			dirname( plugin_basename( GUTEN_BRIDGE ) ) . '/languages/'
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
	public function load_block_editor_translations() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				'guten-bridge-script',
				'guten-bridge',
				plugin_dir_path( GUTEN_BRIDGE ) . '/languages'
			);
		}
	}

	public function enqueue_blocks_scripts() {
		wp_enqueue_script(
			'guten-bridge-script',
			plugins_url( 'dist/js/blocks.js', GUTEN_BRIDGE ),
			array(
				'wp-blocks',
				'wp-element',
				'wp-components',
				'wp-editor',
				'wp-block-editor',
				'wp-rich-text',
				'wp-data',
				'wp-i18n',
				// 'wp-server-side-render',
			),
			'',
			true
		);
	}

	public function enqueue_block_editor_styles() {
		wp_enqueue_style(
			'guten-bridge-editor-style',
			plugins_url( 'dist/css/block-editor-style.min.css', GUTEN_BRIDGE )
		);

		$styles = wp_get_custom_css();
		if ( $styles ) {
			$styles = '/* Insert custom css */' . $styles;
			wp_add_inline_style( 'guten-bridge-editor-style', $styles );
		}
	}

	public function enqueue_styles() {
		wp_enqueue_style(
			'guten-bridge-style',
			plugins_url( 'dist/css/blocks.min.css', GUTEN_BRIDGE )
		);
	}
}
