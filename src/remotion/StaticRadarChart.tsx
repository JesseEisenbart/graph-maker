import React from 'react';
import { ATTRIBUTE_COLORS } from '../app/constants/colors';
import {
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
} from 'remotion';
import SkullEmoji from '../app/components/SkullEmoji';

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
    headerText?: string;
    textPositionX?: number; // percentage from left
    textPositionY?: number; // percentage from top
    fontSize?: number; // font size in pixels
    overlayFadeDuration?: number; // seconds for overlay fade out
    textPlugAppearTime?: number; // seconds when text plug appears
}

const StaticRadarChart: React.FC<StaticRadarChartProps> = ({
    data,
    displayData,
    maxValue,
    graphColor,
    overallRating,
    headerBackgroundColor = 'white',
    showCenterNumber = true,
    headerText = '',
    textPositionX = 50,
    textPositionY = 50,
    fontSize = 32,
    overlayFadeDuration = 2,
    textPlugAppearTime = 3,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Calculate overlay opacity based on fade duration
    const overlayFadeEndFrame = Math.floor(overlayFadeDuration * fps);
    const overlayOpacity = interpolate(
        frame,
        [0, overlayFadeEndFrame],
        [1, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Calculate text plug visibility
    const textPlugAppearFrame = Math.floor(textPlugAppearTime * fps);
    const textPlugVisible = frame >= textPlugAppearFrame;

    // Use displayData for numbers if provided, otherwise fall back to data
    const numbersData = displayData || data;

    // Function to parse text and replace skull emojis with custom component
    const parseTextWithSkullEmojis = (text: string) => {
        const skullEmojiRegex = /💀/g;
        const parts = text.split(skullEmojiRegex);
        const matches = text.match(skullEmojiRegex);

        if (!matches) {
            return text;
        }

        const result: React.ReactNode[] = [];
        for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
                result.push(parts[i]);
            }
            if (i < matches.length) {
                result.push(
                    <SkullEmoji
                        key={`skull-${i}`}
                        size={fontSize * 0.9}
                        style={{ margin: '0 2px' }}
                    />
                );
            }
        }
        return result;
    };
    const size = 410;
    const center = size / 2;
    const radius = 125;
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
                backgroundImage: `url(${staticFile('background.png')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                position: 'relative',
            }}
        >
            {/* Header */}
            <div
                style={{
                    backgroundColor: headerBackgroundColor,
                    width: '100%',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {headerText && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${textPositionX}%`,
                            top: `${textPositionY}%`,
                            transform: 'translate(-50%, -50%)',
                            fontFamily: 'TikTok Sans, sans-serif',
                            fontSize: `${fontSize}px`,
                            fontWeight: '600',
                            color:
                                headerBackgroundColor === 'white'
                                    ? '#000000'
                                    : '#ffffff',
                            textAlign: 'center',

                            lineHeight: '1.2',
                        }}
                    >
                        {headerText.split('\n').map((line, index) => (
                            <div
                                key={index}
                                style={{
                                    whiteSpace: 'nowrap',
                                    marginBottom:
                                        index <
                                        headerText.split('\n').length - 1
                                            ? `${fontSize * 0.01}px`
                                            : '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {line
                                    ? parseTextWithSkullEmojis(line)
                                    : '\u00A0'}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                        <filter id="glow">
                            <feGaussianBlur
                                stdDeviation="3"
                                result="coloredBlur"
                            />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="strongGlow">
                            <feGaussianBlur
                                stdDeviation="5"
                                result="coloredBlur"
                            />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
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
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.2)"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Data area with glow */}
                    <path
                        d={dataPath}
                        fill={`${graphColor}20`}
                        stroke={graphColor}
                        strokeWidth="2"
                        filter="url(#strongGlow)"
                    />

                    {/* Additional glow layer */}
                    <path
                        d={dataPath}
                        fill="none"
                        stroke={graphColor}
                        strokeWidth="1"
                        opacity="0.6"
                        style={{ filter: 'blur(2px)' }}
                    />

                    {/* Overall Rating in Center */}
                    {showCenterNumber && (
                        <text
                            x={center}
                            y={center + 18}
                            textAnchor="middle"
                            fill="white"
                            fontSize="48"
                            fontFamily="Instrument Sans, sans-serif"
                            fontWeight="700"
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
                                fontSize: '14px',
                                fontFamily: 'Instrument Sans, sans-serif',
                                fontWeight: '700',
                            }}
                        >
                            {attr.label}
                        </div>
                    );
                })}
            </div>

            {/* Text Plug - "app is called empire habits" */}
            {textPlugVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: '490px',
                        left: '50%',
                        width: '100%',
                        textAlign: 'center',
                        transform: 'translateX(-50%)',
                        fontFamily: 'TikTok Sans, sans-serif',
                        fontWeight: '500',
                        color: '#ffffff',
                        fontSize: '20px',
                    }}
                >
                    app is called empire habits
                </div>
            )}

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    rowGap: '4px',
                    columnGap: '32px',
                    maxWidth: '900px',
                    marginBottom: '8px',
                }}
            >
                {attributes.map((attr) => (
                    <div key={attr.key} style={{ textAlign: 'left' }}>
                        <div
                            style={{
                                fontSize: '14px',
                                letterSpacing: '-0.025em',
                                fontFamily: 'Instrument Sans, sans-serif',
                                color: attr.color,
                                marginBottom: '-4px',
                                fontWeight: '600',
                                textShadow: `0 0 12px ${attr.color}`,
                            }}
                        >
                            {attr.label}
                        </div>
                        <div
                            style={{
                                fontSize: '36px',
                                color: 'white',
                                fontFamily: 'Instrument Sans, sans-serif',
                                fontWeight: '700',
                            }}
                        >
                            {attr.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Black overlay that fades out */}
            {overlayOpacity > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '145px', // Start below the header
                        left: '0',
                        right: '0',
                        bottom: '0',
                        backgroundColor: 'black',
                        opacity: overlayOpacity,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    );
};

export default StaticRadarChart;
