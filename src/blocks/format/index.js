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
import { fontSize } from './font-size';
import { fontWeight } from './font-weight';

[
	highlight,
	badge,
	fontSize,
	fontWeight,
].forEach( ( { name, ...settings } ) =>
	registerFormatType( name, settings )
);
