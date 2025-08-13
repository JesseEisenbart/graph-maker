'use client';

import React from 'react';
import { Player } from '@remotion/player';
import { RadarChartVideo } from '../../remotion/RadarChartVideo';
import { ASPECT_RATIOS } from '../../remotion/AspectRatios';

interface GraphData {
    strength: number;
    relationship: number;
    discipline: number;
    mental: number;
    focus: number;
    ambition: number;
}

interface RemotionPlayerPreviewProps {
    beforeData: GraphData;
    afterData: GraphData;
    beforeGraphColor: string;
    afterGraphColor: string;
    animationDuration: number;
    initialDelay: number;
    totalDuration: number;
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

const RemotionPlayerPreview: React.FC<RemotionPlayerPreviewProps> = ({
    beforeData,
    afterData,
    beforeGraphColor,
    afterGraphColor,
    animationDuration,
    initialDelay,
    totalDuration,
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
    // Use portrait aspect ratio for the preview
    const aspectRatio = ASPECT_RATIOS.PORTRAIT_9_16;
    const fps = 30;
    const durationInFrames = Math.ceil(totalDuration * fps);

    // Calculate player size to fit nicely in the layout
    const playerWidth = 400;
    const playerHeight = (playerWidth * aspectRatio.height) / aspectRatio.width;

    const inputProps = {
        beforeData,
        afterData,
        beforeGraphColor,
        afterGraphColor,
        graphColor: afterGraphColor, // Use after color as main color
        overallRating,
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
        overlayFadeDuration,
        textPlugAppearTime,
    };

    return (
        <div className="flex flex-col items-center">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                <Player
                    component={RadarChartVideo}
                    durationInFrames={durationInFrames}
                    compositionWidth={aspectRatio.width}
                    compositionHeight={aspectRatio.height}
                    fps={fps}
                    style={{
                        width: playerWidth,
                        height: playerHeight,
                    }}
                    inputProps={inputProps}
                    controls
                    loop
                    autoPlay={false}
                    showVolumeControls={true}
                    clickToPlay
                    doubleClickToFullscreen
                    allowFullscreen
                />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
                Preview: {totalDuration}s animation
            </p>
        </div>
    );
};

export default RemotionPlayerPreview;
