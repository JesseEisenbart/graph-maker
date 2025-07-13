import React from 'react';
import { Composition } from 'remotion';
import { RadarChartVideo } from './RadarChartVideo';
import { ASPECT_RATIOS } from './AspectRatios';

// Change this to any aspect ratio from AspectRatios.ts
const CURRENT_ASPECT_RATIO = ASPECT_RATIOS.PORTRAIT_9_16;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id='RadarChartAnimation'
				component={RadarChartVideo}
				durationInFrames={300} // Default 10 seconds at 30fps, will be overridden by calculateMetadata
				fps={30}
				width={CURRENT_ASPECT_RATIO.width}
				height={CURRENT_ASPECT_RATIO.height}
				calculateMetadata={({ props }) => {
					// Dynamic duration based on totalDuration prop
					const fps = 30;
					const totalDuration = props.totalDuration || 10;
					return {
						durationInFrames: Math.ceil(totalDuration * fps),
					};
				}}
				defaultProps={{
					beforeData: {
						strength: 68,
						relationship: 33,
						discipline: 68,
						mental: 68,
						focus: 68,
						ambition: 68,
					},
					afterData: {
						strength: 85,
						relationship: 70,
						discipline: 90,
						mental: 75,
						focus: 80,
						ambition: 88,
					},
					graphColor: '#00ff6a',
					overallRating: 85,
					animationDuration: 8,
					initialDelay: 1,
					totalDuration: 10,
				}}
			/>
		</>
	);
};
