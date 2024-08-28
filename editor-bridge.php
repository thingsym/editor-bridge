<?php
/**
 * Plugin Name: Editor Bridge
 * Plugin URI: https://github.com/thingsym/editor-bridge
 * Description: This WordPress plugin expands the functionality of core blocks and adds styles and formats.
 * Version: 1.8.3
 * Author: thingsym
 * Author URI:  https://www.thingslabo.com/
 * License:     GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: editor-bridge
 * Domain Path: /languages
 *
 * @package Editor_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'EDITOR_BRIDGE', __FILE__ );

require_once plugin_dir_path( __FILE__ ) . 'inc/class-editor-bridge.php';

if ( class_exists( 'Editor_Bridge\Editor_Bridge' ) ) {
	new \Editor_Bridge\Editor_Bridge();
};
