import React, { useEffect, useState } from 'react';
import { ATTRIBUTE_COLORS } from '../app/constants/colors';

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
}

const VideoRadarChart: React.FC<RadarChartProps> = ({
	data,
	maxValue,
	graphColor,
	overallRating,
	animationDuration = 2,
	disableInternalAnimation = false,
}) => {
	const [animatedValues, setAnimatedValues] = useState({
		strength: 0,
		relationship: 0,
		discipline: 0,
		mental: 0,
		focus: 0,
		ambition: 0,
	});

	// Use data directly when internal animation is disabled (for video export)
	const displayValues = disableInternalAnimation ? data : animatedValues;

	useEffect(() => {
		if (disableInternalAnimation) {
			setAnimatedValues(data);
			return;
		}

		const startValues = { ...animatedValues };
		const steps = Math.ceil(animationDuration * 60); // 60 FPS
		const stepDuration = (animationDuration * 1000) / steps;
		let currentStep = 0;

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

	const size = 440;
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

	// Generate path for the data area
	const dataPoints = attributes.map((attr, index) =>
		getPoint(displayValues[attr.key as keyof typeof displayValues], index)
	);

	const dataPath =
		dataPoints
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
			)
			.join(' ') + ' Z';

	return (
		<div style={{ position: 'relative' }}>
			<svg
				width={size}
				height={size}
				style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
			>
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
				<text
					x={center}
					y={center + 18}
					textAnchor='middle'
					fill='white'
					fontSize='54'
					fontFamily='Instrument Serif, serif'
				>
					{overallRating}
				</text>
			</svg>

			{/* Labels */}
			{attributes.map((attr, index) => {
				const labelPoint = getGridPoint(levels + 0.3, index);

				return (
					<div
						key={attr.key}
						style={{
							position: 'absolute',
							left: labelPoint.x,
							top: labelPoint.y,
							transform: 'translate(-50%, -50%)',
							textAlign: 'center',
							color: attr.color,
							textShadow: `0 0 12px ${attr.color}`,
							fontSize: '18px',
							fontFamily: 'Instrument Serif, serif',
						}}
					>
						<div style={{ marginBottom: '4px' }}>{attr.label}</div>
					</div>
				);
			})}
		</div>
	);
};

export default VideoRadarChart;
