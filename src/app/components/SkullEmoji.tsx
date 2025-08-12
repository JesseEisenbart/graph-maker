import React from 'react';
import { staticFile } from 'remotion';

interface SkullEmojiProps {
	size?: number; // Size in pixels
	style?: React.CSSProperties;
}

const SkullEmoji: React.FC<SkullEmojiProps> = ({ size = 24, style = {} }) => {
	return (
		<img
			src={staticFile('skull-emoji.png')}
			alt='💀'
			style={{
				width: `${size + 7}px`,
				height: `${size + 7}px`,
				paddingLeft: '2px',
				display: 'inline-block',
				verticalAlign: 'middle',
				...style,
			}}
		/>
	);
};

export default SkullEmoji;
