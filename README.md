# Editor Bridge

WordPress plugin Editor Bridge expand the Block Editor (Gutenberg).
This WordPress plugin expands the functionality of blocks and adds styles and formats.

* [Demo sample (English)](https://cms.thingslabo.com/demo/foresight/sample-page/wordpress-plugin-editor-bridge-demo-sample/)
* [デモサンプル (日本語)](https://cms.thingslabo.com/demo/foresight/sample-page/wordpress-plugin-editor-bridge-demo-sample-ja/)

## Expansion

There are three expansion points.

### Expanded block

* Background image
	* core/heading
	* core/paragraph
	* core/column
	* core/columns
	* core/group
* Border
	* core/heading
	* core/paragraph
	* core/group
	* core/columns
* Button size and width
	* core/button
* Space, Margin (upper margin as default) and Padding
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

### Format

* Badge
* Font size
* Font weight
* Highlight

### Style

* Button
* Heading
* Image
* Separator
* Table

## Installation

1. Download and unzip files. Or install Editor Bridge plugin using the WordPress plugin installer. In that case, skip 2.
2. Upload "editor-bridge" to the "/wp-content/plugins/" directory.
3. Activate the plugin through the 'Plugins' menu in WordPress.
4. Have fun!

## Compatibility

- WordPress version 5.5 or later
- Gutenberg version 8.5 or later

## WordPress Plugin Directory

Editor Bridge is hosted on the WordPress Plugin Directory.

[https://wordpress.org/plugins/editor-bridge/](https://wordpress.org/plugins/editor-bridge/)

## Test Matrix

For operation compatibility between PHP version and WordPress version, see below [Travis CI](https://travis-ci.com/thingsym/editor-bridge).

## Build development environment

```console
cd /path/to/editor-bridge

# Install package
npm intall

# Show tasks list
npm run

# Build plugin
npm run build
```

### PHP unit testing with PHPUnit

```console
cd /path/to/editor-bridge

# Install package
composer intall

# Show tasks list
composer run --list

# Run test
composer run phpunit
```

## Contribution

### Patches and Bug Fixes

Small patches and bug reports can be submitted a issue tracker in Github. Forking on Github is another good way. You can send a pull request.

1. Fork [Editor Bridge](https://github.com/thingsym/editor-bridge) from GitHub repository
2. Create a feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Create new Pull Request

## Changelog

### [1.0.2] - 2020.11.02

* add background color to image table block style 'Frame'
* remove table block style 'Underline Emphasis'
* fix separator block style 'Circle Mark'
* redesign heading block style 'Stripe Line'
* rename heading block style name

### [1.0.1] - 2020.10.23 - for plugin review

- change the plugin name and slug to Editor Bridge

### [1.0.0] - 2020.10.21

- initial release

## License

Licensed under [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html).
