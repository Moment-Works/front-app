# microCMS API Contract

**Feature**: Blog Article Listing and Detail Pages  
**API Provider**: microCMS  
**Version**: v1  
**Date**: 2025-12-06

## Overview

This document defines the contract between our Next.js application and the microCMS API for fetching blog articles and categories.

---

## Authentication

### Environment Variables

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain  # e.g., "your-blog"
MICROCMS_API_KEY=your-api-key                # API key from microCMS dashboard
```

### Headers

All requests must include:

```http
X-MICROCMS-API-KEY: {MICROCMS_API_KEY}
```

---

## Endpoints

### 1. Get All Blog Articles

Fetch a list of blog articles with pagination and filtering support.

**Endpoint**: `GET https://{MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/blogs`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of items to return (default: 10, max: 1000) |
| offset | number | No | Number of items to skip (default: 0) |
| orders | string | No | Sort order (e.g., `-publishedAt` for newest first) |
| filters | string | No | Filter expression (e.g., `category[equals]category-id`) |
| fields | string | No | Comma-separated list of fields to return |
| depth | number | No | Depth of relation field expansion (default: 1) |

**Request Example**:

```http
GET https://your-blog.microcms.io/api/v1/blogs?limit=1000&orders=-publishedAt
X-MICROCMS-API-KEY: your-api-key
```

**Response Schema**:

```typescript
{
  "contents": [
    {
      "id": "article-id-1",
      "title": "Article Title",
      "content": "<p>HTML content from richEditorV2...</p>",
      "eyecatch": {
        "url": "https://images.microcms-assets.io/...",
        "width": 1200,
        "height": 630
      },
      "categories": [
        {
          "id": "category-id-1",
          "name": "Tech",
          "createdAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-01-01T00:00:00.000Z"
        },
        {
          "id": "category-id-2",
          "name": "Tutorial",
          "createdAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "publishedAt": "2025-12-06T00:00:00.000Z",
      "createdAt": "2025-12-05T00:00:00.000Z",
      "updatedAt": "2025-12-06T00:00:00.000Z",
      "revisedAt": "2025-12-06T00:00:00.000Z"
    }
  ],
  "totalCount": 42,
  "offset": 0,
  "limit": 1000
}
```

**Status Codes**:

- `200 OK`: Successful response
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Endpoint not found
- `500 Internal Server Error`: microCMS server error

---

### 2. Get Single Blog Article

Fetch a single blog article by ID.

**Endpoint**: `GET https://{MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/blogs/{id}`

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Unique article ID |

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fields | string | No | Comma-separated list of fields to return |
| depth | number | No | Depth of relation field expansion (default: 1) |

**Request Example**:

```http
GET https://your-blog.microcms.io/api/v1/blogs/article-id-1
X-MICROCMS-API-KEY: your-api-key
```

**Response Schema**:

```typescript
{
  "id": "article-id-1",
  "title": "Article Title",
  "content": "<p>HTML content from richEditorV2...</p>",
  "eyecatch": {
    "url": "https://images.microcms-assets.io/...",
    "width": 1200,
    "height": 630
  },
  "categories": [
    {
      "id": "category-id-1",
      "name": "Tech",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "category-id-2",
      "name": "Tutorial",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "publishedAt": "2025-12-06T00:00:00.000Z",
  "createdAt": "2025-12-05T00:00:00.000Z",
  "updatedAt": "2025-12-06T00:00:00.000Z",
  "revisedAt": "2025-12-06T00:00:00.000Z"
}
```

**Status Codes**:

- `200 OK`: Successful response
- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Article not found
- `500 Internal Server Error`: microCMS server error

---

### 3. Get All Categories

Fetch all available categories.

**Endpoint**: `GET https://{MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/categories`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of items to return (default: 10, max: 1000) |
| offset | number | No | Number of items to skip (default: 0) |
| fields | string | No | Comma-separated list of fields to return |

**Request Example**:

```http
GET https://your-blog.microcms.io/api/v1/categories?limit=100
X-MICROCMS-API-KEY: your-api-key
```

**Response Schema**:

```typescript
{
  "contents": [
    {
      "id": "category-id-1",
      "name": "Tech",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "category-id-2",
      "name": "Design",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 5,
  "offset": 0,
  "limit": 100
}
```

**Status Codes**:

- `200 OK`: Successful response
- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Endpoint not found
- `500 Internal Server Error`: microCMS server error

---

## Data Types

### Blog Article Schema

```typescript
interface MicroCMSBlog {
  id: string;                    // Unique identifier
  title: string;                 // Article title
  content: string;               // HTML from richEditorV2
  eyecatch?: {                   // Optional featured image
    url: string;
    width: number;
    height: number;
  };
  categories?: Array<{           // Optional categories relationList
    id: string;
    name: string;
    createdAt: string;           // ISO 8601
    updatedAt: string;           // ISO 8601
  }>;
  publishedAt?: string;          // ISO 8601 (optional, may be null for drafts)
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
  revisedAt: string;             // ISO 8601
}
```

### Category Schema

```typescript
interface MicroCMSCategory {
  id: string;                    // Unique identifier
  name: string;                  // Category display name
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

### List Response Wrapper

```typescript
interface MicroCMSListResponse<T> {
  contents: T[];                 // Array of content items
  totalCount: number;            // Total number of items
  offset: number;                // Current offset
  limit: number;                 // Items per page
}
```

---

## Error Handling

### Error Response Format

```typescript
{
  "message": "Error description",
  "statusCode": 400
}
```

### Common Error Scenarios

1. **Invalid API Key**

   ```json
   {
     "message": "Invalid API key",
     "statusCode": 401
   }
   ```

2. **Article Not Found**

   ```json
   {
     "message": "Content not found",
     "statusCode": 404
   }
   ```

3. **Rate Limit Exceeded**

   ```json
   {
     "message": "Rate limit exceeded",
     "statusCode": 429
   }
   ```

---

## Rate Limits

microCMS enforces rate limits based on your plan:

- **Hobby Plan**: 10 requests/second
- **Business Plan**: 50 requests/second
- **Enterprise Plan**: Custom limits

For build-time fetching (SSG), rate limits are generally not a concern since builds happen infrequently.

---

## Best Practices

### 1. Batch Fetching

Fetch all articles in a single request during build:

```typescript
// ✅ Good: Single request with high limit
const { contents } = await client.getList({
  endpoint: 'blogs',
  queries: { limit: 1000, orders: '-publishedAt' }
});

// ❌ Bad: Multiple requests
for (let i = 0; i < 10; i++) {
  await client.getList({
    endpoint: 'blogs',
    queries: { limit: 10, offset: i * 10 }
  });
}
```

### 2. Field Selection

Request only needed fields to reduce response size:

```typescript
const { contents } = await client.getList({
  endpoint: 'blogs',
  queries: {
    fields: 'id,title,eyecatch,categories,publishedAt',
    limit: 1000
  }
});
```

### 3. Depth Control

Control relation depth to avoid over-fetching:

```typescript
const { contents } = await client.getList({
  endpoint: 'blogs',
  queries: {
    depth: 1, // Expand relations 1 level deep
    limit: 1000
  }
});
```

### 4. Error Recovery

Implement retry logic for transient failures:

```typescript
async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetcher();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Build-Time vs Runtime

### Build-Time (SSG)

All API calls happen during `next build`:

```typescript
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const { contents } = await client.getList({ endpoint: 'blogs' });
  return contents.map(blog => ({ slug: blog.id }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await client.get({ endpoint: 'blogs', contentId: params.slug });
  return <Article data={article} />;
}
```

### Runtime

**No runtime API calls** - all data embedded in static pages.

---

## Testing Contract

### Mock Data Structure

```typescript
// __mocks__/microcms-data.ts

export const mockBlog: MicroCMSBlog = {
  id: 'test-article-1',
  title: 'Test Article',
  content: '<h1>Hello World</h1><p>This is test content.</p>',
  eyecatch: {
    url: 'https://example.com/image.jpg',
    width: 1200,
    height: 630
  },
  categories: [
    {
      id: 'tech',
      name: 'Technology',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 'tutorial',
      name: 'Tutorial',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    }
  ],
  publishedAt: '2025-12-06T00:00:00.000Z',
  createdAt: '2025-12-05T00:00:00.000Z',
  updatedAt: '2025-12-06T00:00:00.000Z',
  revisedAt: '2025-12-06T00:00:00.000Z'
};
```

### Contract Validation

Implement runtime validation for API responses:

```typescript
import { z } from 'zod';

const MicroCMSBlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  eyecatch: z.object({
    url: z.string().url(),
    width: z.number(),
    height: z.number()
  }).optional(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
  })).optional(),
  publishedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  revisedAt: z.string()
});

// Validate API response
const validatedBlog = MicroCMSBlogSchema.parse(apiResponse);
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-06 | Initial contract definition |

---

## References

- [microCMS API Documentation](https://document.microcms.io/content-api/get-list-contents)
- [microCMS JavaScript SDK](https://github.com/microcmsio/microcms-js-sdk)
- [Project Data Model](../data-model.md)
