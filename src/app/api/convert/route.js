import { NextResponse } from 'next/server';
import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs';

// Disable body parsing for the API route
export const dynamic = 'force-dynamic'; // Use this for dynamic rendering
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

// Handle POST requests
export const POST = async (req) => {
  const form = formidable();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(new NextResponse('Error parsing form', { status: 500 }));
      }

      const file = files.image;
      const outputFormat = fields.outputFormat || 'jpeg'; // Default to 'jpeg'

      try {
        // Use sharp to convert the image
        const convertedBuffer = await sharp(file.filepath)
          .toFormat(outputFormat)
          .toBuffer();

        // Clean up temporary file after processing
        fs.unlink(file.filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Failed to delete temporary file', unlinkErr);
        });

        // Create a response with the converted image
        const response = new NextResponse(convertedBuffer, {
          status: 200,
          headers: {
            'Content-Type': `image/${outputFormat}`,
          },
        });

        resolve(response); // Send back the converted image
      } catch (error) {
        console.error(error);
        reject(new NextResponse('Image conversion failed', { status: 500 }));
      }
    });
  });
};
