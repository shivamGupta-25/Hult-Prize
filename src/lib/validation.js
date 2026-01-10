import { z } from 'zod';

export const blogSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
    slug: z.string()
        .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens')
        .or(z.literal('')) // Allow empty string (will be auto-generated)
        .optional()
        .transform(v => v === '' ? undefined : v),
    excerpt: z.string().trim().optional(),
    content: z.string().min(1, 'Content is required'),
    posterImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
    author: z.string().min(1, 'Author name is required').trim(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});

export const updateBlogSchema = blogSchema.partial(); // All fields optional for updates

export const commentSchema = z.object({
    author: z.string().min(1, 'Author name is required').trim(),
    content: z.string().min(1, 'Comment content is required').trim(),
});
