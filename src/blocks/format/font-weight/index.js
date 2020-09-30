'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	useState,
} from '@wordpress/element';
import {
	RichTextToolbarButton,
 } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	default as InlineFontWeightUI,
	getActiveFontWeight,
} from './font-weight-popover.js';
import { fontWeightSolid } from './icons';

const name  = 'guten-plus/font-weight';
const title = __( 'Font Weight', 'guten-plus' );

function FontWeightEdit( { value, onChange, isActive, activeAttributes } ) {
	const [ isAddingFontWeight, setIsAddingFontWeight ] = useState( false );

	const enableIsAddingFontWeight = useCallback( () => setIsAddingFontWeight( true ), [
		setIsAddingFontWeight,
	] );

	const disableIsAddingFontWeight = useCallback( () => setIsAddingFontWeight( false ), [
		setIsAddingFontWeight,
	] );

	return (
		<>
			<RichTextToolbarButton
				key={ isActive ? 'text-color' : 'text-color-not-active' }
				className="format-library-text-color-button"
				name={ isActive ? 'text-color' : undefined }
				isPressed={ isActive ? true : false }
				icon={
					<>
						<Icon
							icon={ fontWeightSolid }
							style={{
								width: '18px',
								height: '18px',
							}}
						/>
					</>
				}
				title={ title }
				onClick={ enableIsAddingFontWeight }
			/>
			{ isAddingFontWeight && (
				<InlineFontWeightUI
					name={ name }
					addingFontWeight={ isAddingFontWeight }
					isActive={ isActive }
					onChange={ onChange }
					onClose={ disableIsAddingFontWeight }
					activeAttributes={ activeAttributes }
					value={ value }
				/>
			) }
		</>
	);
}

export const font_weight = {
	name,
	title,
	tagName: 'span',
	className: 'guten-plus-has-font-weight',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: FontWeightEdit,
};
