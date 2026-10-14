import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    seriesId: z.string(),
    seriesTitle: z.string(),
    readingOrder: z.number().default(1),
    publishedDate: z.string(),
    lastReviewedDate: z.string(),
    author: z.string().default('Chirag Singhal'),
    category: z.string(),
    readTime: z.string(),
    tags: z.array(z.string()).default([]),
    keyTakeaways: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).optional(),
    citations: z.array(z.string()).default([]),
    status: z.enum(['planned', 'draft', 'reviewed', 'published']).default('published'),
  }),
});

export const collections = { articles };
