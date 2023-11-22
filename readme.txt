=== Editor Bridge ===

Contributors: thingsym
Link: https://github.com/thingsym/editor-bridge
Donate link: https://github.com/sponsors/thingsym
Stable tag: 1.8.2
Tested up to: 6.4.1
Requires at least: 5.5
Requires PHP: 7.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Tags: block, block editor, gutenberg

Editor Bridge plugin expands the functionality of core blocks and adds styles and formats.

== Description ==

WordPress plugin Editor Bridge expand the Block Editor (Gutenberg).
This WordPress plugin expands the functionality of core blocks and adds styles and formats.

= Compatibility =

- WordPress version 5.5 or later
- Gutenberg version 8.5 or later

= Required plugins =

Editor Bridge will need other recommended plugins to use icons library as Web Font.

[Font Awesome](https://ja.wordpress.org/plugins/font-awesome/)

= Demo =

* [Demo sample (English)](https://demo.thingslabo.com/foresight/sample-page/wordpress-plugin-editor-bridge-demo-sample)
* [デモサンプル (日本語)](https://demo.thingslabo.com/foresight/sample-page/wordpress-plugin-editor-bridge-demo-sample-ja)

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
	* core/column
* Button size and width settings
	* core/button
* Container settings
	* core/group
	* core/cover
* Space settings, Margin (upper margin as default), Padding and Gap
	* core/heading
	* core/paragraph
	* core/image
	* core/button (only Margin)
	* core/buttons
	* core/media-text
	* core/gallery (only Margin)
	* core/list (only Margin)
	* core/table (only Margin)
	* core/columns
	* core/column (only Padding)
	* core/group
	* core/cover
* Width settings
	* core/table
	* core/columns
	* core/group

= Format =

* Badge
* Font size
* Font weight
* Highlight

= Style =

* Button
* Heading
* Image
* List
* Media Text
* Separator
* Table

= Support =

If you have any trouble, you can use the forums or report bugs.

* Forum: [https://wordpress.org/support/plugin/editor-bridge/](https://wordpress.org/support/plugin/editor-bridge/)
* Issues: [https://github.com/thingsym/editor-bridge/issues](https://github.com/thingsym/editor-bridge/issues)

= Contribution =

Small patches and bug reports can be submitted a issue tracker in Github. Forking on Github is another good way. You can send a pull request.

Translating a plugin takes a lot of time, effort, and patience. I really appreciate the hard work from these contributors.

If you have created or updated your own language pack, you can send gettext PO and MO files to author. I can bundle it into plugin.

* [VCS - GitHub](https://github.com/thingsym/editor-bridge)
* [Homepage - WordPress Plugin](https://wordpress.org/plugins/editor-bridge/)
* [Translate Editor Bridge into your language.](https://translate.wordpress.org/projects/wp-plugins/editor-bridge)

You can also contribute by answering issues on the forums.

* Forum: [https://wordpress.org/support/plugin/editor-bridge/](https://wordpress.org/support/plugin/editor-bridge/)
* Issues: [https://github.com/thingsym/editor-bridge/issues](https://github.com/thingsym/editor-bridge/issues)

= Contribute guidlines =

If you would like to contribute, here are some notes and guidlines.

* All development happens on the **develop** branch, so it is always the most up-to-date
* The **master** branch only contains tagged releases
* If you are going to be submitting a pull request, please submit your pull request to the **develop** branch
* See about [forking](https://help.github.com/articles/fork-a-repo/) and [pull requests](https://help.github.com/articles/using-pull-requests/)

= Test Matrix =

For operation compatibility between PHP version and WordPress version, see below [GitHub Actions](https://github.com/thingsym/editor-bridge/actions).

== Installation ==

1. Download and unzip files. Or install Editor Bridge plugin using the WordPress plugin installer. In that case, skip 2.
2. Upload "editor-bridge" to the "/wp-content/plugins/" directory.
3. Activate the plugin through the 'Plugins' menu in WordPress.
4. Have fun!

== Changelog ==

= 1.8.2 - 2023.11.22 =
* tested up to 6.4.1
* fix npm scrips
* update npm dependencies
* imporve code with phpcs
* fix Parameter excludes_analyse has been deprecated for phpstan
* fix phpunit.xml config
* phpunit-polyfills bump up
* remove shallow and snapshot jest test
* update npm dependencies
* fix composer script
* fix .editorconfig
* fix Deprecated: Creation of dynamic property for ci
* support php 8.0 or later
* fix uiux css
* fix classname

= 1.8.1 - 2023.04.21 =
* tested up to 6.2.0
* fix jest snapshots
* fix jest config
* update npm dependencies
* add npm scripts
* fix composer scripts
* update github actions, Node.js 12 actions are deprecated

= 1.8.0 - 2022.12.05 =
* tested up to 6.1.0
* update japanese translation
* update pot
* add jest test case
* remove anchorRef
* fix jest config
* fix scss
* fix list style
* fix return value for testability
* add msgmerge to npm scripts
* add support section and enhance contribution section
* fix license
* fix rgba error
* add icon color to control
* add valueType to icon-select-control
* fix npm scripts
* fix scss included modules path
* change handle name and method name
* fix .gitignore
* separate scss files by block style
* move scss files to each block folder
* change blocks style path
* add thinking style to core/media-text

= 1.7.0 - 2022.08.16 =
* update japanese translation
* update pot
* enable padding space for media-text
* fix scss
* add icon block style to list
* add icon selector
* add block style to media-text
* remove css media query
* add gap space
* improve code and change block attributes from custom data to extra class
* refactoring, refine code
* add block centered alignment

= 1.6.1 - 2022.07.04 =
* fix table layout
* fix responsive
* fix hr
* fix square and circle list styles
* disable width setting if wide align or full align

= 1.6.0 - 2022.05.03 =
* change mysql from version 8.0 to version 5.7 using docker image
* fix test case
* update japanese translation
* update pot
* update package.json
* cleanup code
* add text color to badge format
* change icon with badge format
* rename from styleSlug to classNameSlug
* remove withSpokenMessages
* change assert from assertEquals to assertSame

= 1.5.1 - 2022.02.09 =
* fix scss
* update japanese translation
* update pot

= 1.5.0 - 2022.02.01 =
* tested up to 5.9.0
* update japanese translation
* update pot
* remove unused functions
* fix scss for popover
* fix wp-block-separator style for dotted
* change popover to TabPanel
* update npm dependencies
* improve getActive** functions, change from replace() to match()
* change svg icon for RichTextToolbarButton
* support font units for FontSizePicker
* fix RichTextToolbarButton behavior when active for WordPress 5.9
* change scss library from LibSass to dart sass

= 1.4.0 - 2022.01.07 =
* add jest unit test only php 7.4
* fix composer install via composer.json
* bump up yoast/phpunit-polyfills version
* change os to ubuntu-20.04
* update japanese translation
* update pot
* add test case for jest
* fix npm scripts
* update npm dependencies for jest
* fix plugin_data and asset_file
* improve popover
* fix test case
* move jest.config.js to root path
* add Dot style to highlight
* improve list block scss
* set initial color
* add Frame style to table block
* change font size and improve stack and line-height
* add timeout-minutes to workflows

= 1.3.0 - 2021.09.17 =
* update japanese translation
* update pot
* fix panel display order
* add border expansion with core/column
* add list style
* fix wp-block-table css
* add Asterisk style with with core/separator
* remove Shadow and Circle Mark style with with core/separator
* add width settings expansion
* fix disable-padding-horizontal
* add edit-widgets-block-editor selector for block widgets area
* remove unit with font size

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
