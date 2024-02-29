'use strict';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { default as InlineFontSizeUI } from './font-size-popover.js';
import { fontSolid } from './icons';

const name  = 'editor-bridge/font-size';
const title = __( 'Font Size', 'editor-bridge' );

function FontSizeEdit( {
	value,
	onChange,
	isActive,
	activeAttributes,
	contentRef,
} ) {
	const [ isAddingFontSize, setIsAddingFontSize ] = useState( false );
	const enableIsAddingFontSize = useCallback(
		() => setIsAddingFontSize( true ),
		[ setIsAddingFontSize ]
	);
	const disableIsAddingFontSize = useCallback(
		() => setIsAddingFontSize( false ),
		[ setIsAddingFontSize ]
	);

	return (
		<>
			<RichTextToolbarButton
				isActive={ isActive }
				className="editor-bridge-font-size-text-color-button"
				icon={
					<Icon
						icon={ fontSolid }
						style={{
							width: '22px',
							height: '22px',
							padding: '0.2rem',
						}}
					/>
				}
				label={ title }
				title={ title }
				onClick={ enableIsAddingFontSize }
				role="menuitemcheckbox"
			/>
			{ isAddingFontSize && (
				<InlineFontSizeUI
					name={ name }
					addingFontSize={ isAddingFontSize }
					isActive={ isActive }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					onClose={ disableIsAddingFontSize }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

export const fontSize = {
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
