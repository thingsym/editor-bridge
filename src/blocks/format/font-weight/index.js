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
import { default as InlineFontWeightUI } from './font-weight-popover.js';
import { fontWeightSolid } from './icons';

const name  = 'editor-bridge/font-weight';
const title = __( 'Font Weight', 'editor-bridge' );

function FontWeightEdit( {
	value,
	onChange,
	isActive,
	activeAttributes,
	contentRef,
} ) {
	const [ isAddingFontWeight, setIsAddingFontWeight ] = useState( false );
	const enableIsAddingFontWeight = useCallback(
		() => setIsAddingFontWeight( true ),
		[ setIsAddingFontWeight ]
	);
	const disableIsAddingFontWeight = useCallback(
		() => setIsAddingFontWeight( false ),
		[ setIsAddingFontWeight ]
	);

	return (
		<>
			<RichTextToolbarButton
				isActive={ isActive }
				className="editor-bridge-font-weight-button"
				icon={
					<Icon
						icon={ fontWeightSolid }
						style={{
							width: '22px',
							height: '22px',
							padding: '0.2rem',
						}}
					/>
				}
				label={ title }
				title={ title }
				onClick={ enableIsAddingFontWeight }
				role="menuitemcheckbox"
			/>
			{ isAddingFontWeight && (
				<InlineFontWeightUI
					name={ name }
					addingFontWeight={ isAddingFontWeight }
					isActive={ isActive }
					activeAttributes={ activeAttributes }
					value={ value }
					onChange={ onChange }
					onClose={ disableIsAddingFontWeight }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

export const fontWeight = {
	name,
	title,
	tagName: 'span',
	className: 'editor-bridge-has-font-weight',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: FontWeightEdit,
};
