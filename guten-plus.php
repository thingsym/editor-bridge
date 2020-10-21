<?php
/**
 * Plugin Name: Guten Plus
 * Plugin URI: https://github.com/thingsym/guten-plus
 * Description: A extended Block Editor (Gutenberg).
 * Version: 1.0.0
 * Author: thingsym
 * Author URI:  https://www.thingslabo.com/
 * License:     GPL2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: guten-plus
 * Domain Path: /languages/
 *
 * @package Guten_Plus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GUTEN_PLUS', __FILE__ );
define( 'GUTEN_PLUS_PATH', plugin_dir_path( GUTEN_PLUS ) );

require_once GUTEN_PLUS_PATH . 'inc/class-guten-plus.php';

if ( class_exists( 'Guten_Plus\Guten_Plus' ) ) {
	new \Guten_Plus\Guten_Plus();
};
