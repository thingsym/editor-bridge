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
import { font_weight } from './font-weight';

[
	highlight,
	badge,
	font_size,
	font_weight,
].forEach( ( { name, ...settings } ) =>
	registerFormatType( name, settings )
);
