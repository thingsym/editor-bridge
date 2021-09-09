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
	default as InlineFontSizeUI
} from './font-size-popover.js';
import { fontSolid } from './icons';

const name  = 'editor-bridge/font-size';
const title = __( 'Font Size', 'editor-bridge' );

function FontSizeEdit( { value, onChange, isActive, activeAttributes } ) {
	const [ isAddingFontSize, setIsAddingFontSize ] = useState( false );

	const enableIsAddingFontSize = useCallback( () => setIsAddingFontSize( true ), [
		setIsAddingFontSize,
	] );

	const disableIsAddingFontSize = useCallback( () => setIsAddingFontSize( false ), [
		setIsAddingFontSize,
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
							icon={ fontSolid }
							style={{
								width: '16px',
								height: '16px',
							}}
						/>
					</>
				}
				title={ title }
				onClick={ enableIsAddingFontSize }
			/>
			{ isAddingFontSize && (
				<InlineFontSizeUI
					name={ name }
					addingFontSize={ isAddingFontSize }
					isActive={ isActive }
					onChange={ onChange }
					onClose={ disableIsAddingFontSize }
					activeAttributes={ activeAttributes }
					value={ value }
				/>
			) }
		</>
	);
}

export const font_size = {
	name,
	title,
	tagName: 'span',
	className: 'editor-bridge-has-font-size',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: FontSizeEdit,
};
