<?php
/**
 * Plugin Name: Guten Bridge
 * Plugin URI: https://github.com/thingsym/guten-bridge
 * Description: A extends Gutenberg.
 * Version: 0.1.0
 * Author: thingsym
 * Author URI:  http://www.thingslabo.com/
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

require_once plugin_dir_path( __FILE__ ) . 'inc/class-guten-bridge.php';

if ( class_exists( 'Guten_Bridge\Guten_Bridge' ) ) {
	new \Guten_Bridge\Guten_Bridge();
};
