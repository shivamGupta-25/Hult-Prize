import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Standardized API Error Handler
 * @param {Error} error 
 * @returns {NextResponse}
 */
export function handleApiError(error) {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation Error', details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Handle known service errors
  if (error.message === 'Blog not found' || error.message === 'Comment not found') {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error.message === 'Unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (error.message.includes('already exists')) { // Duplicate key error usually
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}

/**
 * Helper to validate request body against a schema
 * @param {Request} request 
 * @param {z.Schema} schema 
 * @returns {Promise<any>} Parsed body
 */
export async function validateRequest(request, schema) {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON');
    }
    throw error;
  }
}
