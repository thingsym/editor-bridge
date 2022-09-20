<?php
/**
 * Class Test_Editor_Bridge_Basic
 *
 * @package Editor_Bridge
 */

/**
 * Basic test case.
 */
class Test_Editor_Bridge_Basic extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();
		$this->editor_bridge = new \Editor_Bridge\Editor_Bridge();
	}

	/**
	 * @test
	 * @group basic
	 */
	function basic() {
		// for renaming repo
		$this->assertRegExp( '#/editor-bridge.php$#', EDITOR_BRIDGE );
		// $this->assertRegExp( '#/editor-bridge/editor-bridge.php$#', EDITOR_BRIDGE );

		$this->assertTrue( class_exists( '\Editor_Bridge\Editor_Bridge' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	function public_variable() {
		$this->assertIsArray( $this->editor_bridge->plugin_data );
		$this->assertEmpty( $this->editor_bridge->plugin_data );

		$this->assertIsArray( $this->editor_bridge->asset_file );
		$this->assertEmpty( $this->editor_bridge->asset_file );
	}

	/**
	 * @test
	 * @group basic
	 */
	function constructor() {
		$this->assertSame( 10, has_action( 'plugins_loaded', [ $this->editor_bridge, 'load_plugin_data' ] ) );
		$this->assertSame( 10, has_action( 'plugins_loaded', [ $this->editor_bridge, 'load_asset_file' ] ) );

		$this->assertSame( 10, has_action( 'plugins_loaded', [ $this->editor_bridge, 'init' ] ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	function init() {
		$this->editor_bridge->init();

		$this->assertSame( 10, has_action( 'init', [ $this->editor_bridge, 'load_textdomain' ] ) );
		$this->assertSame( 10, has_filter( 'enqueue_block_editor_assets', [ $this->editor_bridge, 'set_block_editor_translations' ] ) );

		$this->assertSame( 10, has_filter( 'wp_enqueue_scripts', [ $this->editor_bridge, 'enqueue_styles' ] ) );
		$this->assertSame( 10, has_filter( 'enqueue_block_assets', [ $this->editor_bridge, 'enqueue_block_asset_styles' ] ) );
		$this->assertSame( 10, has_filter( 'enqueue_block_editor_assets', [ $this->editor_bridge, 'enqueue_blocks_editor_scripts' ] ) );
		$this->assertSame( 10, has_filter( 'enqueue_block_editor_assets', [ $this->editor_bridge, 'enqueue_block_editor_styles' ] ) );

		$this->assertSame( 10, has_filter( 'plugin_row_meta', array( $this->editor_bridge, 'plugin_metadata_links' ) ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function load_plugin_data() {
		$this->editor_bridge->load_plugin_data();
		$result = $this->editor_bridge->plugin_data;

		$this->assertTrue( is_array( $result ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function load_asset_file() {
		$this->editor_bridge->load_asset_file();
		$result = $this->editor_bridge->asset_file;

		$this->assertTrue( is_array( $result ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function load_textdomain() {
		$result = $this->editor_bridge->load_textdomain();
		$this->assertNull( $result );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function plugin_metadata_links() {
		$links = $this->editor_bridge->plugin_metadata_links( array(), plugin_basename( EDITOR_BRIDGE ) );
		$this->assertContains( '<a href="https://github.com/sponsors/thingsym">Become a sponsor</a>', $links );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function set_block_editor_translations() {
		$this->markTestIncomplete( 'This test has not been implemented yet.' );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_blocks_editor_scripts() {
		$this->editor_bridge->load_asset_file();
		$this->editor_bridge->enqueue_blocks_editor_scripts();
		$this->assertTrue( wp_script_is( 'editor-bridge-editor-script' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_block_editor_styles() {
		$this->editor_bridge->load_plugin_data();
		$this->editor_bridge->enqueue_block_editor_styles();
		$this->assertTrue( wp_style_is( 'editor-bridge-block-editor' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_styles() {
		$this->editor_bridge->load_plugin_data();
		$this->editor_bridge->enqueue_styles();
		$this->assertTrue( wp_style_is( 'editor-bridge' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_block_asset_styles() {
		$this->editor_bridge->load_plugin_data();
		$this->editor_bridge->enqueue_block_asset_styles();
		$this->assertTrue( wp_style_is( 'editor-bridge-block-asset' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	function uninstall() {
		$this->markTestIncomplete( 'This test has not been implemented yet.' );
	}

}
