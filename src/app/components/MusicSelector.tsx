'use client';

import React, { useState } from 'react';

interface MusicTrack {
    id: string;
    title: string;
    filename: string;
    duration?: string;
    artist?: string;
}

interface MusicSelectorProps {
    selectedTrack: string | null;
    onTrackSelect: (trackId: string | null) => void;
}

const MusicSelector: React.FC<MusicSelectorProps> = ({
    selectedTrack,
    onTrackSelect,
}) => {
    const [isPlaying, setIsPlaying] = useState<string | null>(null);

    // Available music tracks
    const musicTracks: MusicTrack[] = [
        {
            id: 'none',
            title: 'No Music',
            filename: '',
            duration: '',
            artist: 'Silent',
        },
        {
            id: 'let-it-happen',
            title: 'Let It Happen',
            filename: 'let-it-happen-1.mp3',
            duration: '7:47',
            artist: 'Tame Impala',
        },
        {
            id: 'that-one-bro',
            title: 'That One Bro',
            filename: 'that-one-bro.mp3',
            duration: '2:34',
            artist: 'Unknown Artist',
        },
        {
            id: 'study',
            title: 'Study',
            filename: 'study.mp3',
            duration: '2:34',
            artist: 'Unknown Artist',
        },
        {
            id: 'sad-times',
            title: 'Sad Times',
            filename: 'sad-times.mp3',
            duration: '2:34',
            artist: 'Unknown Artist',
        },
        {
            id: 'big-drop',
            title: 'Big Drop',
            filename: 'big-drop.mp3',
            duration: '2:34',
            artist: 'Unknown Artist',
        },
    ];

    const handleTrackSelect = (trackId: string) => {
        onTrackSelect(trackId === 'none' ? null : trackId);
        setIsPlaying(null); // Stop any playing preview
    };

    const handlePreviewToggle = (trackId: string) => {
        if (trackId === 'none') return;

        if (isPlaying === trackId) {
            setIsPlaying(null);
        } else {
            setIsPlaying(trackId);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-white font-sans">
                Background Music
            </label>

            <div className="grid grid-cols-1 gap-3">
                {musicTracks.map((track) => (
                    <div
                        key={track.id}
                        className={`relative p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedTrack === track.id ||
                            (selectedTrack === null && track.id === 'none')
                                ? 'border-blue-500 bg-blue-500/20'
                                : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-white/5'
                        }`}
                        onClick={() => handleTrackSelect(track.id)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-white font-semibold text-sm">
                                    {track.title}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    {track.artist}
                                    {track.duration && ` • ${track.duration}`}
                                </div>
                            </div>

                            {track.id !== 'none' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewToggle(track.id);
                                    }}
                                    className={`ml-3 p-2 rounded-full transition-all ${
                                        isPlaying === track.id
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-gray-600 hover:bg-gray-700'
                                    }`}
                                    title={
                                        isPlaying === track.id
                                            ? 'Stop Preview'
                                            : 'Preview'
                                    }
                                >
                                    {isPlaying === track.id ? (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Selected indicator */}
                        {(selectedTrack === track.id ||
                            (selectedTrack === null &&
                                track.id === 'none')) && (
                            <div className="absolute top-2 right-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                            </div>
                        )}

                        {/* Hidden audio element for preview */}
                        {track.filename && (
                            <audio
                                key={track.id}
                                onEnded={() => setIsPlaying(null)}
                                ref={(audio) => {
                                    if (audio) {
                                        if (isPlaying === track.id) {
                                            audio.currentTime = 0;
                                            audio.play().catch(console.error);
                                        } else {
                                            audio.pause();
                                        }
                                    }
                                }}
                            >
                                <source
                                    src={`/${track.filename}`}
                                    type="audio/mpeg"
                                />
                            </audio>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-xs text-gray-500 mt-2">
                Click a track to select it for your video. Use the play button
                to preview.
            </div>
        </div>
    );
};

export default MusicSelector;
