'use client';

import { useState } from 'react';
import RadarChart from './RadarChart';
import VideoExportButton from './VideoExportButton';
import { ATTRIBUTE_COLORS, PRESET_GRAPH_COLORS } from '../constants/colors';

interface GraphData {
	strength: number;
	relationship: number;
	discipline: number;
	mental: number;
	focus: number;
	ambition: number;
}

const GraphBuilder: React.FC = () => {
	const [beforeData, setBeforeData] = useState<GraphData>({
		strength: 68,
		relationship: 33,
		discipline: 68,
		mental: 68,
		focus: 68,
		ambition: 68,
	});

	const [afterData, setAfterData] = useState<GraphData>({
		strength: 85,
		relationship: 70,
		discipline: 90,
		mental: 75,
		focus: 80,
		ambition: 88,
	});

	const [currentData, setCurrentData] = useState<GraphData>(beforeData);
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationDuration, setAnimationDuration] = useState(3); // seconds
	const [initialDelay, setInitialDelay] = useState(1); // seconds before animation starts
	const [totalDuration, setTotalDuration] = useState(10); // total video duration in seconds
	const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

	const [graphColor, setGraphColor] = useState<string>(
		ATTRIBUTE_COLORS.strength
	);
	const [headerBackgroundColor, setHeaderBackgroundColor] = useState<
		'black' | 'white'
	>('white');

	const maxValue = 100;

	const attributes = [
		{
			key: 'strength',
			label: 'STRENGTH',
			color: ATTRIBUTE_COLORS.strength,
		},
		{
			key: 'relationship',
			label: 'RELATIONSHIP',
			color: ATTRIBUTE_COLORS.relationship,
		},
		{
			key: 'discipline',
			label: 'DISCIPLINE',
			color: ATTRIBUTE_COLORS.discipline,
		},
		{ key: 'mental', label: 'KNOWLEDGE', color: ATTRIBUTE_COLORS.mental },
		{
			key: 'focus',
			label: 'FOCUS',
			color: ATTRIBUTE_COLORS.focus,
		},
		{
			key: 'ambition',
			label: 'AMBITION',
			color: ATTRIBUTE_COLORS.ambition,
		},
	];

	const handleValueChange = (key: keyof GraphData, value: number) => {
		const setterFunction =
			activeTab === 'before' ? setBeforeData : setAfterData;
		setterFunction((prev) => ({
			...prev,
			[key]: value,
		}));

		// Update current data if we're editing the active tab
		if (activeTab === 'before') {
			setCurrentData((prev) => ({ ...prev, [key]: value }));
		} else {
			setCurrentData((prev) => ({ ...prev, [key]: value }));
		}
	};

	const randomizeValues = () => {
		const newData = {
			strength: Math.floor(Math.random() * maxValue),
			relationship: Math.floor(Math.random() * maxValue),
			discipline: Math.floor(Math.random() * maxValue),
			mental: Math.floor(Math.random() * maxValue),
			focus: Math.floor(Math.random() * maxValue),
			ambition: Math.floor(Math.random() * maxValue),
		};

		if (activeTab === 'before') {
			setBeforeData(newData);
			setCurrentData(newData);
		} else {
			setAfterData(newData);
			setCurrentData(newData);
		}
	};

	const resetToBeforeValues = () => {
		setCurrentData(beforeData);
		setActiveTab('before');
	};

	const playAnimation = () => {
		if (isAnimating) return;

		setIsAnimating(true);
		setCurrentData(beforeData);

		// Animate the numbers gradually
		const duration = animationDuration * 1000; // Convert to milliseconds
		const steps = 60; // 60 FPS
		const stepDuration = duration / steps;
		let currentStep = 0;
		const startValues = { ...beforeData };
		const targetValues = { ...afterData };

		const animationTimer = setInterval(() => {
			currentStep++;
			const progress = Math.min(currentStep / steps, 1);

			// Easing function for smooth animation
			const easeOut = 1 - Math.pow(1 - progress, 3);

			// Interpolate between start and target values
			const interpolatedData: GraphData = {
				strength: Math.round(
					startValues.strength +
						(targetValues.strength - startValues.strength) * easeOut
				),
				relationship: Math.round(
					startValues.relationship +
						(targetValues.relationship - startValues.relationship) *
							easeOut
				),
				discipline: Math.round(
					startValues.discipline +
						(targetValues.discipline - startValues.discipline) *
							easeOut
				),
				mental: Math.round(
					startValues.mental +
						(targetValues.mental - startValues.mental) * easeOut
				),
				focus: Math.round(
					startValues.focus +
						(targetValues.focus - startValues.focus) * easeOut
				),
				ambition: Math.round(
					startValues.ambition +
						(targetValues.ambition - startValues.ambition) * easeOut
				),
			};

			setCurrentData(interpolatedData);

			if (progress >= 1) {
				clearInterval(animationTimer);
				setIsAnimating(false);
				setCurrentData(afterData); // Ensure we end exactly on target values
			}
		}, stepDuration);
	};

	const activeData = activeTab === 'before' ? beforeData : afterData;
	const overallRating = Math.round(
		Object.values(currentData).reduce((a, b) => a + b, 0) /
			Object.values(currentData).length
	);

	return (
		<div className='min-h-screen bg-black flex flex-row items-center justify-center p-8'>
			<div className='flex flex-col lg:flex-row items-center gap-24'>
				{/* Controls */}
				<div className='bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 w-full lg:w-96'>
					{/* Before/After Tabs */}
					<div className='flex rounded-lg bg-black/40 p-1 mb-6'>
						<button
							onClick={() => setActiveTab('before')}
							className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
								activeTab === 'before'
									? 'bg-blue-600 text-white shadow-lg'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							Before
						</button>
						<button
							onClick={() => setActiveTab('after')}
							className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
								activeTab === 'after'
									? 'bg-green-600 text-white shadow-lg'
									: 'text-gray-400 hover:text-white'
							}`}
						>
							After
						</button>
					</div>
					<div className='space-y-4'>
						{attributes.map((attr) => (
							<div key={attr.key} className='space-y-2'>
								<div className='flex justify-between items-center'>
									<label
										className='text-sm font-semibold'
										style={{
											color: attr.color,
										}}
									>
										{attr.label}
									</label>
									<span className='text-white text-sm font-mono'>
										{
											activeData[
												attr.key as keyof GraphData
											]
										}
									</span>
								</div>
								<input
									type='range'
									min='0'
									max={maxValue}
									value={
										activeData[attr.key as keyof GraphData]
									}
									onChange={(e) =>
										handleValueChange(
											attr.key as keyof GraphData,
											parseInt(e.target.value)
										)
									}
									className='w-full h-2 rounded-lg appearance-none cursor-pointer'
									style={{
										accentColor: 'white',
										background: `linear-gradient(to right, ${
											attr.color
										} 0%, ${attr.color} ${
											(activeData[
												attr.key as keyof GraphData
											] /
												maxValue) *
											100
										}%, rgba(255,255,255,0.2) ${
											(activeData[
												attr.key as keyof GraphData
											] /
												maxValue) *
											100
										}%, rgba(255,255,255,0.2) 100%)`,
									}}
								/>
							</div>
						))}
					</div>

					{/* Animation Controls */}
					<div className='mt-8 space-y-4'>
						<div className='space-y-3'>
							<label className='text-sm font-semibold text-white font-sans'>
								Animation Controls
							</label>

							{/* Initial Delay Slider */}
							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-400'>
										Initial Delay
									</span>
									<span className='text-sm text-white font-mono'>
										{initialDelay}s
									</span>
								</div>
								<input
									type='range'
									min='0'
									max='6'
									step='0.5'
									value={initialDelay}
									onChange={(e) =>
										setInitialDelay(
											parseFloat(e.target.value)
										)
									}
									className='accent-white w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-orange-600 to-red-600'
								/>
							</div>

							{/* Duration Slider */}
							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-400'>
										Animation Duration
									</span>
									<span className='text-sm text-white font-mono'>
										{animationDuration}s
									</span>
								</div>
								<input
									type='range'
									min='1'
									max='10'
									step='0.5'
									value={animationDuration}
									onChange={(e) =>
										setAnimationDuration(
											parseFloat(e.target.value)
										)
									}
									className='accent-white w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600'
								/>
							</div>

							{/* Total Duration Slider */}
							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-400'>
										Total Video Length
									</span>
									<span className='text-sm text-white font-mono'>
										{totalDuration}s
									</span>
								</div>
								<input
									type='range'
									min='5'
									max='30'
									step='1'
									value={totalDuration}
									onChange={(e) =>
										setTotalDuration(
											parseFloat(e.target.value)
										)
									}
									className='accent-white w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600'
								/>
							</div>

							{/* Control Buttons */}
							<div className='grid grid-cols-2 gap-3'>
								<button
									onClick={playAnimation}
									disabled={isAnimating}
									className={`flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all transform hover:cursor-pointer ${
										isAnimating
											? 'bg-gray-600 text-gray-400 cursor-not-allowed'
											: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
									}`}
								>
									{isAnimating ? 'Playing...' : 'Play'}
								</button>
								<button
									onClick={resetToBeforeValues}
									className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:cursor-pointer'
								>
									Reset
								</button>
							</div>
						</div>
					</div>

					{/* Graph Color Picker */}
					<div className='mt-8 space-y-3'>
						<div className='space-y-3'>
							<label className='text-sm font-semibold text-white font-sans'>
								Graph Color
							</label>

							{/* Color Presets */}
							<div className='grid grid-cols-4 gap-2'>
								{PRESET_GRAPH_COLORS.map((color) => (
									<button
										key={color}
										onClick={() => setGraphColor(color)}
										className={`w-full h-8 rounded border-2 transition-all ${
											graphColor === color
												? 'border-white scale-110'
												: 'border-white/30 hover:border-white/60'
										}`}
										style={{ backgroundColor: color }}
										title={color.toUpperCase()}
									/>
								))}
							</div>

							{/* Custom Color Picker */}
							<div className='flex items-center space-x-3'>
								<input
									type='color'
									value={graphColor}
									onChange={(e) =>
										setGraphColor(e.target.value)
									}
									className='w-12 h-8 rounded border-2 border-white/20 cursor-pointer bg-transparent'
								/>
								<div
									className='flex-1 h-8 rounded border border-white/20 flex items-center justify-center text-white text-sm font-mono'
									style={{
										backgroundColor: graphColor + '20',
										borderColor: graphColor,
									}}
								>
									{graphColor.toUpperCase()}
								</div>
							</div>
						</div>
					</div>

					{/* Header Background Color */}
					<div className='mt-8 space-y-3'>
						<label className='text-sm font-semibold text-white font-sans'>
							Header Background Color
						</label>
						<div className='flex rounded-lg bg-black/40 p-1'>
							<button
								onClick={() => setHeaderBackgroundColor('white')}
								className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
									headerBackgroundColor === 'white'
										? 'bg-white text-black shadow-lg'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								White
							</button>
							<button
								onClick={() => setHeaderBackgroundColor('black')}
								className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
									headerBackgroundColor === 'black'
										? 'bg-black text-white shadow-lg border border-white/20'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Black
							</button>
						</div>
					</div>

					{/* Video Export Section */}
					<div className='mt-8 space-y-5'>
						<label className='text-sm font-semibold text-white font-sans mb-4'>
							Export Video
						</label>
						<VideoExportButton
							beforeData={beforeData}
							afterData={afterData}
							graphColor={graphColor}
							animationDuration={animationDuration}
							initialDelay={initialDelay}
							totalDuration={totalDuration}
							currentData={currentData}
							overallRating={overallRating}
							headerBackgroundColor={headerBackgroundColor}
						/>
					</div>
				</div>

				{/* Chart */}
				<div className='flex flex-col items-center'>
					<RadarChart
						data={currentData}
						maxValue={maxValue}
						graphColor={graphColor}
						overallRating={overallRating}
						animationDuration={animationDuration}
						disableInternalAnimation={isAnimating}
					/>

					{/* Stats Grid */}
					<div className='mt-8 grid grid-cols-3 gap-6 max-w-3xl'>
						{attributes.map((attr) => (
							<div key={attr.key} className='text-start'>
								<div
									className='text-2xl -tracking-normal font-serif'
									style={{
										color: attr.color,
										textShadow: `0 0 10px ${attr.color}`,
									}}
								>
									{attr.label}
								</div>
								<div className='text-5xl text-white font-serif'>
									{currentData[attr.key as keyof GraphData]}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GraphBuilder;
