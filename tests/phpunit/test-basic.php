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

		$this->assertRegExp( '#' . plugin_dir_path( EDITOR_BRIDGE ) . '$#', EDITOR_BRIDGE_PATH );
	}

	/**
	 * @test
	 * @group basic
	 */
	function constructor() {
		$this->assertEquals( 10, has_action( 'plugins_loaded', [ $this->editor_bridge, 'init' ] ) );

		$this->assertEquals( 10, has_filter( 'wp_enqueue_scripts', [ $this->editor_bridge, 'enqueue_styles' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_assets', [ $this->editor_bridge, 'enqueue_block_asset_styles' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_editor_assets', [ $this->editor_bridge, 'enqueue_blocks_scripts' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_editor_assets', [ $this->editor_bridge, 'enqueue_block_editor_styles' ] ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	function init() {
		$this->editor_bridge->init();

		$this->assertEquals( 10, has_action( 'init', [ $this->editor_bridge, 'load_textdomain' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_editor_assets', [ $this->editor_bridge, 'set_block_editor_translations' ] ) );
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
	public function set_block_editor_translations() {
		$this->markTestIncomplete( 'This test has not been implemented yet.' );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_blocks_scripts() {
		$this->editor_bridge->enqueue_blocks_scripts();
		$this->assertTrue( wp_script_is( 'editor-bridge-script' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_block_editor_styles() {
		$this->editor_bridge->enqueue_block_editor_styles();
		$this->assertTrue( wp_style_is( 'editor-bridge-block-editor' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_styles() {
		$this->editor_bridge->enqueue_styles();
		$this->assertTrue( wp_style_is( 'editor-bridge' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_block_asset_styles() {
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
