import React from 'react';
import { ATTRIBUTE_COLORS } from '../app/constants/colors';

interface StaticRadarChartProps {
	data: {
		strength: number;
		relationship: number;
		discipline: number;
		mental: number;
		focus: number;
		ambition: number;
	};
	displayData?: {
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
	headerBackgroundColor?: 'black' | 'white';
	showCenterNumber?: boolean;
}

const StaticRadarChart: React.FC<StaticRadarChartProps> = ({
	data,
	displayData,
	maxValue,
	graphColor,
	overallRating,
	headerBackgroundColor = 'white',
	showCenterNumber = true,
}) => {
	// Use displayData for numbers if provided, otherwise fall back to data
	const numbersData = displayData || data;
	const size = 410;
	const center = size / 2;
	const radius = 140;
	const levels = 3;

	// Calculate points for the radar chart
	const getPoint = (value: number, index: number) => {
		const angle = (index * 60 - 90) * (Math.PI / 180);
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
			value: numbersData.strength,
		},
		{
			key: 'relationship',
			label: 'RELATIONSHIP',
			color: ATTRIBUTE_COLORS.relationship,
			value: numbersData.relationship,
		},
		{
			key: 'discipline',
			label: 'DISCIPLINE',
			color: ATTRIBUTE_COLORS.discipline,
			value: numbersData.discipline,
		},
		{
			key: 'mental',
			label: 'KNOWLEDGE',
			color: ATTRIBUTE_COLORS.mental,
			value: numbersData.mental,
		},
		{
			key: 'focus',
			label: 'FOCUS',
			color: ATTRIBUTE_COLORS.focus,
			value: numbersData.focus,
		},
		{
			key: 'ambition',
			label: 'AMBITION',
			color: ATTRIBUTE_COLORS.ambition,
			value: numbersData.ambition,
		},
	];

	// Generate path for the data area
	const dataPoints = attributes.map((attr, index) =>
		getPoint(data[attr.key as keyof typeof data], index)
	);

	const dataPath =
		dataPoints
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
			)
			.join(' ') + ' Z';

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				fontFamily:
					'Instrument Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				backgroundColor: '#0d0d0d',
			}}
		>
			{/* Header */}
			<div
				style={{
					backgroundColor: headerBackgroundColor,
					width: '100%',
					height: '145px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			></div>

			{/* Chart */}
			<div style={{ position: 'relative', marginTop: '-12px' }}>
				<svg
					width={size}
					height={size}
					style={{
						filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
					}}
				>
					<defs>
						<filter id='glow'>
							<feGaussianBlur
								stdDeviation='3'
								result='coloredBlur'
							/>
							<feMerge>
								<feMergeNode in='coloredBlur' />
								<feMergeNode in='SourceGraphic' />
							</feMerge>
						</filter>
						<filter id='strongGlow'>
							<feGaussianBlur
								stdDeviation='5'
								result='coloredBlur'
							/>
							<feMerge>
								<feMergeNode in='coloredBlur' />
								<feMergeNode in='SourceGraphic' />
							</feMerge>
						</filter>
					</defs>

					{/* Grid levels */}
					{Array.from({ length: levels }, (_, level) => {
						const levelPoints = Array.from(
							{ length: 6 },
							(_, index) => getGridPoint(level + 1, index)
						);
						const gridPath =
							levelPoints
								.map(
									(point, index) =>
										`${index === 0 ? 'M' : 'L'} ${
											point.x
										} ${point.y}`
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
					/>

					{/* Additional glow layer */}
					<path
						d={dataPath}
						fill='none'
						stroke={graphColor}
						strokeWidth='1'
						opacity='0.6'
						style={{ filter: 'blur(2px)' }}
					/>

					{/* Overall Rating in Center */}
					{showCenterNumber && (
						<text
							x={center}
							y={center + 18}
							textAnchor='middle'
							fill='white'
							fontSize='52'
							fontFamily='Instrument Serif, Georgia, "Times New Roman", serif'
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
							style={{
								position: 'absolute',
								left: labelPoint.x,
								top: labelPoint.y,
								transform: 'translate(-50%, -50%)',
								textAlign: 'center',
								color: attr.color,
								textShadow: `0 0 12px ${attr.color}`,
								fontSize: '18px',
								fontFamily:
									'Instrument Serif, Georgia, "Times New Roman", serif',
							}}
						>
							{attr.label}
						</div>
					);
				})}
			</div>

			{/* Stats Grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					rowGap: '8px',
					columnGap: '32px',
					maxWidth: '900px',
					marginBottom: '8px',
				}}
			>
				{attributes.map((attr) => (
					<div key={attr.key} style={{ textAlign: 'left' }}>
						<div
							style={{
								fontSize: '20px',
								letterSpacing: '-0.025em',
								fontFamily:
									'Instrument Serif, Georgia, "Times New Roman", serif',
								color: attr.color,
								marginBottom: '-4px',
							}}
						>
							{attr.label}
						</div>
						<div
							style={{
								fontSize: '36px',
								color: 'white',
								fontFamily:
									'Instrument Serif, Georgia, "Times New Roman", serif',
							}}
						>
							{attr.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default StaticRadarChart;
