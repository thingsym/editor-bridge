'use strict';

/**
 * External dependencies
 */
import {
	get,
	isEmpty,
} from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import {
	default as InlineBadgeUI,
} from './badge-popover.js';
import { squareCheck } from './icons';

export const transparentValue = 'rgba(0, 0, 0, 0)';

const name  = 'editor-bridge/badge';
const title = __( 'Badge', 'editor-bridge' );

const EMPTY_ARRAY = [];

function BadgeEdit( {
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

	const enableIsAddingColor = useCallback( () => setIsAddingColor( true ), [
		setIsAddingColor,
	] );

	const disableIsAddingColor = useCallback( () => setIsAddingColor( false ), [
		setIsAddingColor,
	] );

	const hasColorsToChoose = ! isEmpty( colors ) || disableCustomColors !== true;

	if ( ! hasColorsToChoose && ! isActive ) {
		return null;
	}

	return (
		<>
			<RichTextToolbarButton
				className="editor-bridge-badge-text-color-button"
				isActive={ isActive }
				icon={
					<Icon
						icon={ squareCheck }
						style={{
							width: '22px',
							height: '22px',
							padding: '0.2rem',
					}}
					/>
				}
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
				<InlineBadgeUI
					name={ name }
					onClose={ disableIsAddingColor }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

export const badge = {
	name,
	title,
	tagName: 'span',
	className: 'editor-bridge-has-badge',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: BadgeEdit,
};
