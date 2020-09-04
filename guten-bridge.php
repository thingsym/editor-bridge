<?php
/**
 * Plugin Name: Guten Bridge
 * Plugin URI: https://github.com/thingsym/guten-bridge
 * Description: A extended Block Editor (Gutenberg).
 * Version: 0.1.0
 * Author: thingsym
 * Author URI:  https://www.thingslabo.com/
 * License:     GPL2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: guten-bridge
 * Domain Path: /languages/
 *
 * @package Guten_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GUTEN_BRIDGE', __FILE__ );
define( 'GUTEN_BRIDGE_PATH', plugin_dir_path( GUTEN_BRIDGE ) );

require_once GUTEN_BRIDGE_PATH . 'inc/class-guten-bridge.php';

if ( class_exists( 'Guten_Bridge\Guten_Bridge' ) ) {
	new \Guten_Bridge\Guten_Bridge();
};
