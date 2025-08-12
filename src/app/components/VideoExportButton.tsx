'use client';

import React, { useState } from 'react';

interface GraphData {
	strength: number;
	relationship: number;
	discipline: number;
	mental: number;
	focus: number;
	ambition: number;
}

interface VideoExportButtonProps {
	beforeData: GraphData;
	afterData: GraphData;
	beforeGraphColor: string;
	afterGraphColor: string;
	animationDuration: number;
	initialDelay: number;
	totalDuration: number;
	currentData: GraphData;
	overallRating: number;
	headerBackgroundColor: 'black' | 'white';
	showCenterNumber: boolean;
	headerText: string;
	textPositionX: number;
	textPositionY: number;
	fontSize: number;
	selectedMusic: string | null;
	overlayFadeDuration: number;
	textPlugAppearTime: number;
}

const VideoExportButton: React.FC<VideoExportButtonProps> = ({
	beforeData,
	afterData,
	beforeGraphColor,
	afterGraphColor,
	animationDuration,
	initialDelay,
	totalDuration,
	currentData,
	overallRating,
	headerBackgroundColor,
	showCenterNumber,
	headerText,
	textPositionX,
	textPositionY,
	fontSize,
	selectedMusic,
	overlayFadeDuration,
	textPlugAppearTime,
}) => {
	const [isExporting, setIsExporting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleExport = async () => {
		try {
			setIsExporting(true);
			setError(null);

			const response = await fetch('/api/export-video', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					beforeData,
					afterData,
					beforeGraphColor,
					afterGraphColor,
					animationDuration,
					initialDelay,
					totalDuration,
					currentData,
					overallRating,
					headerBackgroundColor,
					showCenterNumber,
					headerText,
					textPositionX,
					textPositionY,
					fontSize,
					selectedMusic,
					overlayFadeDuration,
					textPlugAppearTime,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Export failed');
			}

			// Create download link
			const link = document.createElement('a');
			link.href = result.downloadUrl;
			link.download = result.filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error('Export failed:', err);
			setError(err instanceof Error ? err.message : 'Export failed');
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className='flex flex-col items-center'>
			<button
				onClick={handleExport}
				disabled={isExporting}
				className={`
					px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 w-full
					${isExporting ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-700 transform'}
					shadow-lg hover:shadow-xl
				`}
			>
				{isExporting ? (
					<div className='flex items-center space-x-2'>
						<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
						<span>Exporting Video...</span>
					</div>
				) : (
					<div className='flex items-center space-x-2'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
							/>
						</svg>
						<span>Export as MP4</span>
					</div>
				)}
			</button>

			{error && (
				<p className='text-sm text-red-600 max-w-64 text-center'>
					Error: {error}
				</p>
			)}
		</div>
	);
};

export default VideoExportButton;
