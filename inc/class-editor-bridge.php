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
	 * Public variable.
	 *
	 * @access public
	 *
	 * @var array|null $plugin_data
	 */
	public $plugin_data = array();

	/**
	 * Public variable.
	 *
	 * @access public
	 *
	 * @var array|null $asset_file
	 */
	public $asset_file = array();

	public function __construct() {
		add_action( 'plugins_loaded', [ $this, 'load_plugin_data' ] );
		add_action( 'plugins_loaded', [ $this, 'load_asset_file' ] );

		add_action( 'plugins_loaded', [ $this, 'init' ] );
	}

	/**
	 * Init
	 *
	 * @access public
	 *
	 * @return void
	 *
	 * @since 1.0.0
	 */
	public function init() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		add_action( 'init', [ $this, 'load_textdomain' ] );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueue_block_asset_styles' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_blocks_editor_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_styles' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'set_block_editor_translations' ] );

		add_filter( 'plugin_row_meta', array( $this, 'plugin_metadata_links' ), 10, 2 );
	}

	/**
	 * Load plugin data
	 *
	 * @access public
	 *
	 * @return void
	 *
	 * @since 1.1.0
	 */
	public function load_plugin_data() {
		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
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
	 * @since 1.1.0
	 */
	public function load_asset_file() {
		$this->asset_file = include plugin_dir_path( EDITOR_BRIDGE ) . 'dist/js/blocks.asset.php';
	}

	/**
	 * Load textdomain
	 *
	 * @access public
	 *
	 * @return boolean
	 *
	 * @since 1.0.0
	 */
	public function load_textdomain() {
		return load_plugin_textdomain(
			'editor-bridge',
			false,
			plugin_dir_path( EDITOR_BRIDGE ) . '/languages'
		);
	}

	/**
	 * Set block editor translations
	 *
	 * @access public
	 *
	 * @return boolean
	 *
	 * @since 1.0.0
	 */
	public function set_block_editor_translations() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			return wp_set_script_translations(
				'editor-bridge-editor-script',
				'editor-bridge',
				plugin_dir_path( EDITOR_BRIDGE ) . 'languages'
			);
		}

		return false;
	}

	public function enqueue_blocks_editor_scripts() {
		wp_enqueue_script(
			'editor-bridge-editor-script',
			plugins_url( 'dist/js/blocks.js', EDITOR_BRIDGE ),
			$this->asset_file['dependencies'],
			$this->asset_file['version'],
			[ 'in_footer' => true ]
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

	/**
	 * Set links below a plugin on the Plugins page.
	 *
	 * Hooks to plugin_row_meta
	 *
	 * @see https://developer.wordpress.org/reference/hooks/plugin_row_meta/
	 *
	 * @access public
	 *
	 * @param array  $links  An array of the plugin's metadata.
	 * @param string $file   Path to the plugin file relative to the plugins directory.
	 *
	 * @return array $links
	 *
	 * @since 1.1.1
	 */
	public function plugin_metadata_links( $links, $file ) {
		if ( $file === plugin_basename( EDITOR_BRIDGE ) ) {
			$links[] = '<a href="https://github.com/sponsors/thingsym">' . __( 'Become a sponsor', 'editor-bridge' ) . '</a>';
		}

		return $links;
	}

}
