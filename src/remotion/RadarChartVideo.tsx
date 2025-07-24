import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import StaticRadarChart from './StaticRadarChart';

interface GraphData {
	strength: number;
	relationship: number;
	discipline: number;
	mental: number;
	focus: number;
	ambition: number;
}

interface RadarChartVideoProps {
	beforeData: GraphData;
	afterData: GraphData;
	graphColor: string;
	overallRating: number;
	animationDuration: number;
	initialDelay: number;
	totalDuration: number;
	headerBackgroundColor?: 'black' | 'white';
}

export const RadarChartVideo: React.FC<RadarChartVideoProps> = ({
	beforeData,
	afterData,
	graphColor,
	overallRating,
	animationDuration,
	initialDelay,
	totalDuration,
	headerBackgroundColor = 'white',
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Calculate animation progress with smooth timing
	const animationStartFrame = Math.floor(fps * initialDelay); // Start after initial delay
	const animationEndFrame = Math.floor(
		fps * (initialDelay + animationDuration)
	); // End after delay + animation duration

	const progress = interpolate(
		frame,
		[animationStartFrame, animationEndFrame],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Smooth interpolation between before and after data
	const currentData: GraphData = {
		strength: Math.round(
			beforeData.strength +
				(afterData.strength - beforeData.strength) * progress
		),
		relationship: Math.round(
			beforeData.relationship +
				(afterData.relationship - beforeData.relationship) * progress
		),
		discipline: Math.round(
			beforeData.discipline +
				(afterData.discipline - beforeData.discipline) * progress
		),
		mental: Math.round(
			beforeData.mental +
				(afterData.mental - beforeData.mental) * progress
		),
		focus: Math.round(
			beforeData.focus + (afterData.focus - beforeData.focus) * progress
		),
		ambition: Math.round(
			beforeData.ambition +
				(afterData.ambition - beforeData.ambition) * progress
		),
	};

	// Stepped interpolation for all numbers (increments of 3)
	const createSteppedValue = (beforeValue: number, afterValue: number) => {
		const difference = afterValue - beforeValue;
		const numberOfSteps = Math.ceil(Math.abs(difference) / 3);
		const stepProgress =
			Math.floor(progress * numberOfSteps) / numberOfSteps;
		return beforeValue + Math.round(difference * stepProgress);
	};

	// Stepped data for numbers display (slower, in increments of 3)
	const displayData: GraphData = {
		strength: createSteppedValue(beforeData.strength, afterData.strength),
		relationship: createSteppedValue(
			beforeData.relationship,
			afterData.relationship
		),
		discipline: createSteppedValue(
			beforeData.discipline,
			afterData.discipline
		),
		mental: createSteppedValue(beforeData.mental, afterData.mental),
		focus: createSteppedValue(beforeData.focus, afterData.focus),
		ambition: createSteppedValue(beforeData.ambition, afterData.ambition),
	};

	// Stepped overall rating interpolation (increments of 3)
	const beforeRating = Math.round(
		Object.values(beforeData).reduce((a, b) => a + b, 0) / 6
	);
	const afterRating = Math.round(
		Object.values(afterData).reduce((a, b) => a + b, 0) / 6
	);
	const currentRating = createSteppedValue(beforeRating, afterRating);

	// Auto-scale based on video dimensions
	const aspectRatio = width / height;
	const isVertical = aspectRatio < 1;
	const isSquare = Math.abs(aspectRatio - 1) < 0.1;
	const is9x16 = Math.abs(aspectRatio - 9 / 16) < 0.1;

	// Calculate optimal scale based on video size and aspect ratio
	let contentScale;
	if (is9x16) {
		// For 9:16 (TikTok/Stories), maximize the content size
		contentScale = Math.min(width / 410, height / 830);
	} else if (isVertical) {
		// Other vertical formats
		contentScale = Math.min(width / 500, height / 700);
	} else if (isSquare) {
		// Square format
		contentScale = Math.min(width / 600, height / 600);
	} else {
		// Landscape formats
		contentScale = Math.min(width / 1000, height / 700);
	}

	return (
		<>
			{/* Force immediate font loading for video rendering */}
			<link
				rel='preload'
				href='https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:wght@400&display=block'
				as='style'
			/>
			<link
				href='https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:wght@400&display=block'
				rel='stylesheet'
			/>
			<style>
				{`
					/* Force font display to prevent invisible text */
					* {
						font-display: block !important;
					}
				`}
			</style>

			<div
				style={{
					width: '100%',
					height: '100%',
					background: 'black',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: 'Instrument Sans, sans-serif',
				}}
			>
				<div
					style={{
						transform: `scale(${contentScale})`,
						transformOrigin: 'center',
					}}
				>
					<StaticRadarChart
						data={currentData}
						displayData={displayData}
						maxValue={100}
						graphColor={graphColor}
						overallRating={currentRating}
						headerBackgroundColor={headerBackgroundColor}
					/>
				</div>
			</div>
		</>
	);
};
