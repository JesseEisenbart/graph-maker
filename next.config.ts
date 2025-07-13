import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	webpack: (config, { isServer }) => {
		// Exclude Remotion server-only packages from client bundle
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
				os: false,
				child_process: false,
			};

			config.externals.push({
				'@remotion/bundler': 'commonjs @remotion/bundler',
				'@remotion/renderer': 'commonjs @remotion/renderer',
			});
		}

		return config;
	},
	// Updated configuration for newer Next.js versions
	serverExternalPackages: ['@remotion/bundler', '@remotion/renderer'],
};

export default nextConfig;
