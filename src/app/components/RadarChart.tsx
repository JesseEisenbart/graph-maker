'use client';

import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { ATTRIBUTE_COLORS } from '../constants/colors';

const instrumentSans = Instrument_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-instrument-sans',
});

const instrumentSerif = Instrument_Serif({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-instrument-serif',
});

import { useEffect, useState } from 'react';

interface RadarChartProps {
	data: {
		strength: number;
		relationship: number;
		discipline: number;
		mental: number;
		focus: number;
		ambition: number;
	};
	maxValue: number;
	graphColor: string;
	overallRating: number;
	animationDuration?: number;
	disableInternalAnimation?: boolean;
	showCenterNumber?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
	data,
	maxValue,
	graphColor,
	overallRating,
	animationDuration = 2,
	disableInternalAnimation = false,
	showCenterNumber = true,
}) => {
	const [animatedValues, setAnimatedValues] = useState({
		strength: 0,
		relationship: 0,
		discipline: 0,
		mental: 0,
		focus: 0,
		ambition: 0,
	});

	const attributes = [
		{
			key: 'strength',
			label: 'STRENGTH',
			color: ATTRIBUTE_COLORS.strength,
			value: data.strength,
		},
		{
			key: 'relationship',
			label: 'RELATIONSHIP',
			color: ATTRIBUTE_COLORS.relationship,
			value: data.relationship,
		},
		{
			key: 'discipline',
			label: 'DISCIPLINE',
			color: ATTRIBUTE_COLORS.discipline,
			value: data.discipline,
		},
		{
			key: 'mental',
			label: 'KNOWLEDGE',
			color: ATTRIBUTE_COLORS.mental,
			value: data.mental,
		},
		{
			key: 'focus',
			label: 'FOCUS',
			color: ATTRIBUTE_COLORS.focus,
			value: data.focus,
		},
		{
			key: 'ambition',
			label: 'AMBITION',
			color: ATTRIBUTE_COLORS.ambition,
			value: data.ambition,
		},
	];

	// Smooth animation effect (only when internal animation is enabled)
	useEffect(() => {
		if (disableInternalAnimation) {
			// Immediately set values without animation
			setAnimatedValues(data);
			return;
		}

		const duration = animationDuration * 1000; // Convert to milliseconds
		const steps = 60; // 60 FPS
		const stepDuration = duration / steps;
		let currentStep = 0;
		const startValues = { ...animatedValues };

		const timer = setInterval(() => {
			currentStep++;
			const progress = Math.min(currentStep / steps, 1);

			// Linear interpolation for graph animation
			setAnimatedValues({
				strength: Math.round(
					startValues.strength +
						(data.strength - startValues.strength) * progress
				),
				relationship: Math.round(
					startValues.relationship +
						(data.relationship - startValues.relationship) *
							progress
				),
				discipline: Math.round(
					startValues.discipline +
						(data.discipline - startValues.discipline) * progress
				),
				mental: Math.round(
					startValues.mental +
						(data.mental - startValues.mental) * progress
				),
				focus: Math.round(
					startValues.focus +
						(data.focus - startValues.focus) * progress
				),
				ambition: Math.round(
					startValues.ambition +
						(data.ambition - startValues.ambition) * progress
				),
			});

			if (progress >= 1) {
				clearInterval(timer);
			}
		}, stepDuration);

		return () => clearInterval(timer);
	}, [data, animationDuration, disableInternalAnimation]);

	const size = 480;
	const center = size / 2;
	const radius = 180;
	const levels = 3;

	// Calculate points for the radar chart
	const getPoint = (value: number, index: number) => {
		const angle = (index * 60 - 90) * (Math.PI / 180); // 60 degrees apart, starting from top
		const r = (value / maxValue) * radius;
		return {
			x: center + Math.cos(angle) * r,
			y: center + Math.sin(angle) * r,
		};
	};

	// Get points for grid lines
	const getGridPoint = (level: number, index: number) => {
		const angle = (index * 60 - 90) * (Math.PI / 180);
		const r = (level / levels) * radius;
		return {
			x: center + Math.cos(angle) * r,
			y: center + Math.sin(angle) * r,
		};
	};

	// Generate path for the data area
	const dataPoints = attributes.map((attr, index) =>
		getPoint(animatedValues[attr.key as keyof typeof animatedValues], index)
	);

	const dataPath =
		dataPoints
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
			)
			.join(' ') + ' Z';

	return (
		<div className='relative'>
			<svg width={size} height={size} className='drop-shadow-2xl'>
				{/* Background grid */}
				<defs>
					<filter id='glow'>
						<feGaussianBlur stdDeviation='3' result='coloredBlur' />
						<feMerge>
							<feMergeNode in='coloredBlur' />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>
					<filter id='strongGlow'>
						<feGaussianBlur stdDeviation='5' result='coloredBlur' />
						<feMerge>
							<feMergeNode in='coloredBlur' />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>
				</defs>

				{/* Grid levels */}
				{Array.from({ length: levels }, (_, level) => {
					const levelPoints = Array.from({ length: 6 }, (_, index) =>
						getGridPoint(level + 1, index)
					);
					const gridPath =
						levelPoints
							.map(
								(point, index) =>
									`${index === 0 ? 'M' : 'L'} ${point.x} ${
										point.y
									}`
							)
							.join(' ') + ' Z';

					return (
						<path
							key={level}
							d={gridPath}
							fill='none'
							stroke='rgba(255, 255, 255, 0.2)'
							strokeWidth='1'
						/>
					);
				})}

				{/* Grid lines from center */}
				{/* {Array.from({ length: 6 }, (_, index) => {
					const outerPoint = getGridPoint(levels, index);
					return (
						<line
							key={index}
							x1={center}
							y1={center}
							x2={outerPoint.x}
							y2={outerPoint.y}
							stroke='rgba(255, 255, 255, 0.2)'
							strokeWidth='1'
						/>
					);
				})} */}

				{/* Data area with glow */}
				<path
					d={dataPath}
					fill={`${graphColor}20`}
					stroke={graphColor}
					strokeWidth='2'
					filter='url(#strongGlow)'
					style={{
						transition: 'all 0.3s ease-out',
					}}
				/>

				{/* Additional glow layer */}
				<path
					d={dataPath}
					fill='none'
					stroke={graphColor}
					strokeWidth='1'
					opacity='0.6'
					style={{
						filter: 'blur(2px)',
						transition: 'all 0.3s ease-out',
					}}
				/>

				{/* Overall Rating in Center */}
				{showCenterNumber && (
					<text
						x={center}
						y={center + 18}
						textAnchor='middle'
						fill='white'
						fontSize='54'
						fontFamily={instrumentSerif.style.fontFamily}
					>
						{overallRating}
					</text>
				)}
			</svg>

			{/* Labels */}
			{attributes.map((attr, index) => {
				const labelPoint = getGridPoint(levels + 0.3, index);

				return (
					<div
						key={attr.key}
						className='absolute transform -translate-x-1/2 -translate-y-1/2 text-center'
						style={{
							left: labelPoint.x,
							top: labelPoint.y,
							color: attr.color,
							textShadow: `0 0 12px ${attr.color}`,
							fontSize: '22px',
							fontFamily: instrumentSerif.style.fontFamily,
						}}
					>
						<div className='mb-1'>{attr.label}</div>
					</div>
				);
			})}

			<style jsx>{`
				@keyframes pulse {
					0%,
					100% {
						opacity: 0.8;
						transform: scale(1);
					}
					50% {
						opacity: 1;
						transform: scale(1.05);
					}
				}

				@keyframes glow {
					0%,
					100% {
						filter: drop-shadow(0 0 5px currentColor);
					}
					50% {
						filter: drop-shadow(0 0 15px currentColor);
					}
				}
			`}</style>
		</div>
	);
};

export default RadarChart;
