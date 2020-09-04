'use strict';

/**
 * WordPress dependencies
 */
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */

import { highlight } from './highlight';
import { badge } from './badge';
import { font_size } from './font-size';

[
	highlight,
	badge,
	font_size,
].forEach( ( { name, ...settings } ) =>
	registerFormatType( name, settings )
);
