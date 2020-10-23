<?php
/**
 * Plugin Name: Editor Bridge
 * Plugin URI: https://github.com/thingsym/editor-bridge
 * Description: A extended Block Editor (Gutenberg).
 * Version: 1.0.1
 * Author: thingsym
 * Author URI:  https://www.thingslabo.com/
 * License:     GPL2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: editor-bridge
 * Domain Path: /languages/
 *
 * @package Editor_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'EDITOR_BRIDGE', __FILE__ );
define( 'EDITOR_BRIDGE_PATH', plugin_dir_path( EDITOR_BRIDGE ) );

require_once EDITOR_BRIDGE_PATH . 'inc/class-editor-bridge.php';

if ( class_exists( 'Editor_Bridge\Editor_Bridge' ) ) {
	new \Editor_Bridge\Editor_Bridge();
};
