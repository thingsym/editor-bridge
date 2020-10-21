<?php
/**
 * Class Test_Guten_Plus_Basic
 *
 * @package Guten_Plus
 */

/**
 * Basic test case.
 */
class Test_Guten_Plus_Basic extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();
		$this->guten_plus = new \Guten_Plus\Guten_Plus();
	}

	/**
	 * @test
	 * @group basic
	 */
	function basic() {
		$this->assertRegExp( '#/guten-plus/guten-plus.php$#', GUTEN_PLUS );
		$this->assertTrue( class_exists( '\Guten_Plus\Guten_Plus' ) );

		$this->assertRegExp( '#' . plugin_dir_path( GUTEN_PLUS ) . '$#', GUTEN_PLUS_PATH );
	}

	/**
	 * @test
	 * @group basic
	 */
	function constructor() {
		$this->assertEquals( 10, has_action( 'plugins_loaded', [ $this->guten_plus, 'init' ] ) );

		$this->assertEquals( 10, has_filter( 'wp_enqueue_scripts', [ $this->guten_plus, 'enqueue_styles' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_assets', [ $this->guten_plus, 'enqueue_block_asset_styles' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_editor_assets', [ $this->guten_plus, 'enqueue_blocks_scripts' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_editor_assets', [ $this->guten_plus, 'enqueue_block_editor_styles' ] ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	function init() {
		$this->guten_plus->init();

		$this->assertEquals( 10, has_action( 'init', [ $this->guten_plus, 'load_textdomain' ] ) );
		$this->assertEquals( 10, has_filter( 'enqueue_block_editor_assets', [ $this->guten_plus, 'set_block_editor_translations' ] ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function load_textdomain() {
		$result = $this->guten_plus->load_textdomain();
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
		$this->guten_plus->enqueue_blocks_scripts();
		$this->assertTrue( wp_script_is( 'guten-plus-script' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_block_editor_styles() {
		$this->guten_plus->enqueue_block_editor_styles();
		$this->assertTrue( wp_style_is( 'guten-plus-block-editor' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_styles() {
		$this->guten_plus->enqueue_styles();
		$this->assertTrue( wp_style_is( 'guten-plus' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	public function enqueue_block_asset_styles() {
		$this->guten_plus->enqueue_block_asset_styles();
		$this->assertTrue( wp_style_is( 'guten-plus-block-asset' ) );
	}

	/**
	 * @test
	 * @group basic
	 */
	function uninstall() {
		$this->markTestIncomplete( 'This test has not been implemented yet.' );
	}

}
