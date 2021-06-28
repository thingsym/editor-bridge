=== Editor Bridge ===

Contributors: thingsym
Link: https://github.com/thingsym/editor-bridge
Donate link: https://github.com/sponsors/thingsym
Stable tag: 1.2.1
Tested up to: 5.7.0
Requires at least: 5.5
Requires PHP: 7.1
License: GPL2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Tags: block, block editor, gutenberg

This WordPress plugin expands the functionality of blocks and adds styles and formats.

== Description ==

WordPress plugin Editor Bridge expand the Block Editor (Gutenberg).
This WordPress plugin expands the functionality of blocks and adds styles and formats.

= Compatibility =

- WordPress version 5.5 or later
- Gutenberg version 8.5 or later

= Expansion =

There are three expansion points.

= Expanded block =

* Background image settings
	* core/heading
	* core/paragraph
	* core/column
	* core/columns
	* core/group
* Border settings
	* core/heading
	* core/paragraph
	* core/group
	* core/columns
* Button size and width settings
	* core/button
* Container settings
	* core/group
	* core/cover
* Space settings, Margin (upper margin as default) and Padding
	* core/heading
	* core/paragraph
	* core/image
	* core/button (only Margin)
	* core/buttons
	* core/media-text (only Margin)
	* core/gallery (only Margin)
	* core/list (only Margin)
	* core/table (only Margin)
	* core/columns
	* core/column (only Padding)
	* core/group
	* core/cover

= Format =

* Badge
* Font size
* Font weight
* Highlight

= Style =

* Button
* Heading
* Image
* Separator
* Table

= Test Matrix =

For operation compatibility between PHP version and WordPress version, see below [GitHub Actions](https://github.com/thingsym/editor-bridge/actions).

= Contribution =

Small patches and bug reports can be submitted a issue tracker in GitHub. Forking on GitHub is another good way. You can send a pull request.

* [editor-bridge - GitHub](https://github.com/thingsym/editor-bridge)
* [Editor Bridge - WordPress Plugin](https://wordpress.org/plugins/editor-bridge/)

If you would like to contribute, here are some notes and guidlines.

* All development happens on the **develop** branch, so it is always the most up-to-date
* The **master** branch only contains tagged releases
* If you are going to be submitting a pull request, please submit your pull request to the **develop** branch
* See about [forking](https://help.github.com/articles/fork-a-repo/) and [pull requests](https://help.github.com/articles/using-pull-requests/)

== Installation ==

1. Download and unzip files. Or install Editor Bridge plugin using the WordPress plugin installer. In that case, skip 2.
2. Upload "editor-bridge" to the "/wp-content/plugins/" directory.
3. Activate the plugin through the 'Plugins' menu in WordPress.
4. Have fun!

== Changelog ==

= 1.2.1 - 2021.06.28 =
* fix space
* change disable inner container width to fix layout width

= 1.2.0 - 2021.06.21 =
* exclude README.md with archive:package npm script
* update japanese translation
* update pot
* add container expansion
* remove duplicate settings
* add disable the horizontal setting with padding
* improve border expansion, change default attributes
* add Three Quarters size button
* merge style settings with existing ones
* fix popover width
* fix return color value

= 1.1.2 - 2021.06.09 =
* fix image block styles
* add asset-release workflow

= 1.1.1 - 2021.03.23 =
* remove EDITOR_BRIDGE_PATH constant
* update japanese translation
* update pot
* update package.json
* fix width with components popover of font size format
* fix margin with backgound image icon on the toolbar
* fix button block for wordpress 5.7
* change integer value
* fix .editorconfig
* fix font size
* add test case
* add sponsor link
* update wordpress-test-matrix
* add FUNDING.yml
* add donate link

= 1.1.0 - 2020.11.24 =
* update japanese translation
* update pot
* improve border expansion
* add Thin Underline style to core/heading block
* add One Third button size
* fix uninstall-wp-tests.sh
* fix npm scripts
* fix test case
* move hooks
* add load_asset_file method
* add load_plugin_data method, change version number with wp_enqueue_*
* remove .travis.yml, change CI/CD to GitHub Actions
* add workflow for unit test

= 1.0.2 - 2020.11.02 =
* add background color to image table block style 'Frame'
* remove table block style 'Underline Emphasis'
* fix separator block style 'Circle Mark'
* redesign heading block style 'Stripe Line'
* rename heading block style name

= 1.0.1 - 2020.10.23 =
* change the plugin name and slug to Editor Bridge

= 1.0.0 - 2020.10.21 =
* Initial release
