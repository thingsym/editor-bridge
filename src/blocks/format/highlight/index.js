'use strict';

/**
 * External dependencies
 */
import { get, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { default as InlineHighlightUI } from './highlight-popover.js';
import { highlighterSolid } from './icons';

const name  = 'editor-bridge/highlight';
const title = __( 'Highlight', 'editor-bridge' );

const EMPTY_ARRAY = [];

function HighlightEdit( {
	value,
	onChange,
	isActive,
	activeAttributes,
	contentRef,
} ) {
	const { colors, disableCustomColors } = useSelect( ( select ) => {
		const blockEditorSelect = select( 'core/block-editor' );
		let settings;
		if ( blockEditorSelect && blockEditorSelect.getSettings ) {
			settings = blockEditorSelect.getSettings();
		} else {
			settings = {};
		}
		return {
			colors: get( settings, [ 'colors' ], EMPTY_ARRAY ),
			disableCustomColors: settings.disableCustomColors,
		};
	} );

	const [ isAddingColor, setIsAddingColor ] = useState( false );
	const enableIsAddingColor = useCallback(
		() => setIsAddingColor( true ),
		[ setIsAddingColor ]
	);
	const disableIsAddingColor = useCallback(
		() => setIsAddingColor( false ),
		[ setIsAddingColor ]
	);

	const hasColorsToChoose =
		! isEmpty( colors ) || disableCustomColors !== true;

	if ( ! hasColorsToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<RichTextToolbarButton
				isActive={ isActive }
				className="editor-bridge-highlight-button"
				icon={
					<Icon
						icon={ highlighterSolid }
						style={{
							width: '22px',
							height: '22px',
							padding: '0.2rem',
					}}
					/>
				}
				label={ title }
				title={ title }
				// If has no colors to choose but a color is active remove the color onClick
				onClick={
					hasColorsToChoose
						? enableIsAddingColor
						: () => onChange( removeFormat( value, name ) )
				}
				role="menuitemcheckbox"
			/>
			{ isAddingColor && (
				<InlineHighlightUI
					name={ name }
					addingColor={ isAddingColor }
					isActive={ isActive }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					onClose={ disableIsAddingColor }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

export const highlight = {
	name,
	title,
	tagName: 'span',
	className: 'editor-bridge-has-highlight',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: HighlightEdit,
};
