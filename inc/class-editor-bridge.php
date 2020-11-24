<?php
/**
 * Editor_Bridge class
 *
 * @package Editor_Bridge
 *
 * @since 1.0.0
 */

namespace Editor_Bridge;

/**
 * Core class Editor_Bridge
 *
 * @since 1.0.0
 */
class Editor_Bridge {

	/**
	 * Public value.
	 *
	 * @access public
	 *
	 * @var array|null $plugin_data
	 */
	public $plugin_data;

	/**
	 * Public value.
	 *
	 * @access public
	 *
	 * @var array|null $asset_file
	 */
	public $asset_file;

	public function __construct() {
		add_action( 'plugins_loaded', [ $this, 'load_plugin_data' ] );
		add_action( 'plugins_loaded', [ $this, 'load_asset_file' ] );

		add_action( 'plugins_loaded', [ $this, 'init' ] );
	}

	public function init() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		add_action( 'init', [ $this, 'load_textdomain' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'set_block_editor_translations' ] );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueue_block_asset_styles' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_blocks_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_styles' ] );
	}

	/**
	 * Load plugin data
	 *
	 * @access public
	 *
	 * @return void
	 *
	 * @since 1.0.3
	 */
	public function load_plugin_data() {
		if ( !function_exists( 'get_plugin_data' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

		$this->plugin_data = get_plugin_data( EDITOR_BRIDGE );
	}

	/**
	 * Load asset file
	 *
	 * @access public
	 *
	 * @return void
	 *
	 * @since 1.0.3
	 */
	public function load_asset_file() {
		$this->asset_file = include( EDITOR_BRIDGE_PATH . 'dist/js/blocks.asset.php' );
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
			'editor-bridge',
			false,
			EDITOR_BRIDGE_PATH . '/languages/'
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
				'editor-bridge-script',
				'editor-bridge',
				EDITOR_BRIDGE_PATH . '/languages'
			);
		}
	}

	public function enqueue_blocks_scripts() {
		wp_enqueue_script(
			'editor-bridge-script',
			plugins_url( 'dist/js/blocks.js', EDITOR_BRIDGE ),
			$this->asset_file['dependencies'],
			$this->asset_file['version'],
			true
		);
	}

	public function enqueue_block_editor_styles() {
		wp_enqueue_style(
			'editor-bridge-block-editor',
			plugins_url( 'dist/css/block-editor-style.min.css', EDITOR_BRIDGE ),
			[],
			$this->plugin_data['Version'],
			'all'
		);

		// $styles = wp_get_custom_css();
		// if ( isset( $styles ) ) {
		// 	$styles = '/* Insert custom css */' . $styles;
		// 	wp_add_inline_style( 'editor-bridge-block-asset', $styles );
		// }
	}

	public function enqueue_styles() {
		wp_enqueue_style(
			'editor-bridge',
			plugins_url( 'dist/css/blocks.min.css', EDITOR_BRIDGE ),
			[],
			$this->plugin_data['Version'],
			'all'
		);
	}

	public function enqueue_block_asset_styles() {
		wp_enqueue_style(
			'editor-bridge-block-asset',
			plugins_url( 'dist/css/block-asset.min.css', EDITOR_BRIDGE ),
			[],
			$this->plugin_data['Version'],
			'all'
		);
	}
}
