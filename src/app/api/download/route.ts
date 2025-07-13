import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const filePath = searchParams.get('file');

	if (!filePath) {
		return NextResponse.json(
			{ error: 'File path is required' },
			{ status: 400 }
		);
	}

	try {
		// Security check: ensure the file is in the out directory
		const normalizedPath = path.normalize(filePath);
		const outDir = path.join(process.cwd(), 'out');

		if (!normalizedPath.startsWith(outDir)) {
			return NextResponse.json(
				{ error: 'Invalid file path' },
				{ status: 403 }
			);
		}

		const fileBuffer = await readFile(normalizedPath);
		const fileName = path.basename(normalizedPath);

		return new NextResponse(new Uint8Array(fileBuffer), {
			headers: {
				'Content-Type': 'video/mp4',
				'Content-Disposition': `attachment; filename="${fileName}"`,
				'Content-Length': fileBuffer.length.toString(),
			},
		});
	} catch (error) {
		console.error('Download error:', error);
		return NextResponse.json({ error: 'File not found' }, { status: 404 });
	}
}
