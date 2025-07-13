// Common video aspect ratios for different platforms
export const ASPECT_RATIOS = {
	// Landscape formats
	LANDSCAPE_16_9: {
		width: 1920,
		height: 1080,
		name: '16:9 Landscape (YouTube, TV)',
	},
	LANDSCAPE_21_9: { width: 2560, height: 1080, name: '21:9 Ultrawide' },
	LANDSCAPE_4_3: { width: 1440, height: 1080, name: '4:3 Classic' },

	// Square format
	SQUARE: { width: 1080, height: 1080, name: '1:1 Square (Instagram Post)' },

	// Vertical formats (mobile/social)
	PORTRAIT_9_16: {
		width: 1080,
		height: 1920,
		name: '9:16 Portrait (TikTok, Instagram Stories)',
	},
	PORTRAIT_4_5: {
		width: 1080,
		height: 1350,
		name: '4:5 Portrait (Instagram)',
	},

	// Custom options
	HD_VERTICAL: { width: 720, height: 1280, name: 'HD Vertical' },
	MOBILE_OPTIMIZED: { width: 540, height: 960, name: 'Mobile Optimized' },
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;
