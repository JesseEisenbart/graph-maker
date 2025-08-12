import { NextRequest, NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { mkdir } from 'fs/promises';

interface GraphData {
	strength: number;
	relationship: number;
	discipline: number;
	mental: number;
	focus: number;
	ambition: number;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
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
		} = body;

		// Validate input
		if (
			!beforeData ||
			!afterData ||
			!beforeGraphColor ||
			!afterGraphColor ||
			!animationDuration ||
			initialDelay === undefined ||
			!totalDuration ||
			showCenterNumber === undefined
		) {
			return NextResponse.json(
				{ error: 'Missing required parameters' },
				{ status: 400 }
			);
		}

		// Use provided overall rating or calculate from afterData
		const videoOverallRating =
			overallRating ||
			Math.round(
				Object.values(afterData as GraphData).reduce(
					(a, b) => a + b,
					0
				) / 6
			);

		// Ensure output directory exists
		const outputDir = path.join(process.cwd(), 'out');
		await mkdir(outputDir, { recursive: true });

		// Bundle the Remotion project
		const bundled = await bundle({
			entryPoint: path.join(process.cwd(), 'src/remotion/index.ts'),
			webpackOverride: (config) => config,
		});

		// Get composition
		const composition = await selectComposition({
			serveUrl: bundled,
			id: 'RadarChartAnimation',
			inputProps: {
				beforeData,
				afterData,
				beforeGraphColor,
				afterGraphColor,
				overallRating: videoOverallRating,
				animationDuration,
				initialDelay,
				totalDuration,
				headerBackgroundColor,
				showCenterNumber,
				headerText,
				textPositionX,
				textPositionY,
				fontSize,
				selectedMusic,
			},
		});

		// Generate unique filename
		const filename = `radar-chart-${Date.now()}.mp4`;
		const outputPath = path.join(outputDir, filename);

		// Render video
		await renderMedia({
			composition,
			serveUrl: bundled,
			codec: 'h264',
			outputLocation: outputPath,
			inputProps: {
				beforeData,
				afterData,
				beforeGraphColor,
				afterGraphColor,
				overallRating: videoOverallRating,
				animationDuration,
				initialDelay,
				totalDuration,
				headerBackgroundColor,
				showCenterNumber,
				headerText,
				textPositionX,
				textPositionY,
				fontSize,
				selectedMusic,
			},
		});

		// Return success with filename
		return NextResponse.json({
			success: true,
			filename,
			downloadUrl: `/api/download?file=${encodeURIComponent(outputPath)}`,
		});
	} catch (error) {
		console.error('Video export error:', error);
		return NextResponse.json(
			{
				error: 'Failed to export video',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
