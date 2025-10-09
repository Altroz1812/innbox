# MaxPrefabs API Documentation

## Overview

This document describes the Supabase client API usage in the MaxPrefabs application. All API calls are made through the `@supabase/supabase-js` client library.

**Base Import**:
```typescript
import { supabase } from '@/integrations/supabase/client';
```

---

## Authentication

### Sign Up

Create a new user account.

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: `${window.location.origin}/`,
    data: {
      // Optional user metadata
      full_name: 'John Doe'
    }
  }
});

if (error) {
  console.error('Sign up error:', error.message);
} else {
  console.log('User created:', data.user);
}
```

**Response**:
- `data.user`: User object
- `data.session`: Session object (null if email confirmation required)
- `error`: Error object if failed

---

### Sign In

Authenticate an existing user.

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

if (error) {
  console.error('Sign in error:', error.message);
} else {
  console.log('Session:', data.session);
  console.log('User:', data.user);
}
```

**Response**:
- `data.session`: Active session object
- `data.user`: User object
- `error`: Error object if credentials invalid

---

### Sign Out

End the current user session.

```typescript
const { error } = await supabase.auth.signOut();

if (error) {
  console.error('Sign out error:', error.message);
}
```

---

### Get Current Session

Retrieve the active session.

```typescript
const { data: { session }, error } = await supabase.auth.getSession();

if (session) {
  console.log('User is authenticated:', session.user);
} else {
  console.log('No active session');
}
```

---

### Auth State Listener

Listen for authentication state changes.

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event); // SIGNED_IN, SIGNED_OUT, etc.
    console.log('Session:', session);
    
    if (event === 'SIGNED_IN') {
      // Handle sign in
    } else if (event === 'SIGNED_OUT') {
      // Handle sign out
    }
  }
);

// Unsubscribe when component unmounts
subscription.unsubscribe();
```

**Events**:
- `SIGNED_IN`
- `SIGNED_OUT`
- `TOKEN_REFRESHED`
- `USER_UPDATED`
- `PASSWORD_RECOVERY`

---

## Products

### Fetch All Products

Retrieve all products with images.

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, product_images(*)')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching products:', error.message);
} else {
  console.log('Products:', data);
}
```

**Filtering by Category**:
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, product_images(*)')
  .eq('category', 'Portable Cabins')
  .order('created_at', { ascending: false });
```

---

### Fetch Product by Slug

Retrieve a single product by its URL slug.

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, product_images(*)')
  .eq('slug', 'portable-cabin-20ft')
  .single();

if (error) {
  console.error('Error fetching product:', error.message);
} else {
  console.log('Product:', data);
}
```

---

### Create Product (Admin Only)

Insert a new product.

```typescript
const { data, error } = await supabase
  .from('products')
  .insert({
    name: 'Portable Cabin 20ft',
    slug: 'portable-cabin-20ft',
    category: 'Portable Cabins',
    category_slug: 'portable-cabins',
    short_description: 'Compact and mobile cabin solution',
    description: 'Full detailed description here...',
    features: [
      'Weather resistant',
      'Easy to transport',
      'Quick installation'
    ],
    specifications: [
      { label: 'Dimensions', value: '20ft x 8ft x 8ft' },
      { label: 'Weight', value: '2500 kg' },
      { label: 'Material', value: 'Steel frame with insulated panels' }
    ]
  })
  .select()
  .single();

if (error) {
  console.error('Error creating product:', error.message);
} else {
  console.log('Product created:', data);
}
```

---

### Update Product (Admin Only)

Update an existing product.

```typescript
const { error } = await supabase
  .from('products')
  .update({
    name: 'Updated Product Name',
    description: 'Updated description',
    features: ['Updated feature 1', 'Updated feature 2']
  })
  .eq('id', productId);

if (error) {
  console.error('Error updating product:', error.message);
}
```

---

### Delete Product (Admin Only)

Delete a product (cascades to images and views).

```typescript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);

if (error) {
  console.error('Error deleting product:', error.message);
}
```

---

## Product Images

### Upload Product Image (Admin Only)

Upload image to storage and create database record.

```typescript
// 1. Upload file to storage
const fileName = `${Date.now()}-${file.name}`;
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('product-images')
  .upload(`products/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  });

if (uploadError) {
  console.error('Upload error:', uploadError.message);
  return;
}

// 2. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(`products/${fileName}`);

// 3. Create database record
const { error: dbError } = await supabase
  .from('product_images')
  .insert({
    product_id: productId,
    image_url: publicUrl,
    is_primary: false,
    display_order: 0
  });

if (dbError) {
  console.error('Database error:', dbError.message);
}
```

---

### Set Primary Image (Admin Only)

Designate an image as the primary product image.

```typescript
// 1. Unset all primary images for the product
await supabase
  .from('product_images')
  .update({ is_primary: false })
  .eq('product_id', productId);

// 2. Set new primary image
const { error } = await supabase
  .from('product_images')
  .update({ is_primary: true })
  .eq('id', imageId);
```

---

### Delete Product Image (Admin Only)

Delete image from storage and database.

```typescript
// 1. Extract file path from URL
const urlParts = imageUrl.split('/');
const filePath = `products/${urlParts[urlParts.length - 1]}`;

// 2. Delete from storage
await supabase.storage
  .from('product-images')
  .remove([filePath]);

// 3. Delete from database
const { error } = await supabase
  .from('product_images')
  .delete()
  .eq('id', imageId);
```

---

## Project Gallery

### Fetch Gallery Images

Retrieve all project gallery images.

```typescript
const { data, error } = await supabase
  .from('project_images')
  .select('*')
  .order('display_order', { ascending: true });
```

**Filter by Category**:
```typescript
const { data, error } = await supabase
  .from('project_images')
  .select('*')
  .eq('category', 'Residential')
  .order('display_order', { ascending: true });
```

---

### Upload Gallery Image (Admin Only)

```typescript
// 1. Upload to storage
const fileName = `${Date.now()}-${file.name}`;
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('project-images')
  .upload(`gallery/${fileName}`, file);

if (uploadError) throw uploadError;

// 2. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('project-images')
  .getPublicUrl(`gallery/${fileName}`);

// 3. Create database record
const { error } = await supabase
  .from('project_images')
  .insert({
    title: 'Project Title',
    description: 'Project description',
    category: 'Commercial',
    image_url: publicUrl,
    display_order: 0
  });
```

---

### Update Gallery Image (Admin Only)

```typescript
const { error } = await supabase
  .from('project_images')
  .update({
    title: 'Updated Title',
    description: 'Updated description',
    category: 'Industrial'
  })
  .eq('id', imageId);
```

---

### Delete Gallery Image (Admin Only)

```typescript
// 1. Delete from storage
const urlParts = imageUrl.split('/');
const filePath = `gallery/${urlParts[urlParts.length - 1]}`;
await supabase.storage
  .from('project-images')
  .remove([filePath]);

// 2. Delete from database
const { error } = await supabase
  .from('project_images')
  .delete()
  .eq('id', imageId);
```

---

## Inquiries

### Submit Inquiry (Public)

Submit a contact form inquiry.

```typescript
const { error } = await supabase
  .from('inquiries')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    inquiry_type: 'Product Information',
    message: 'I would like to know more about your portable cabins.'
  });

if (error) {
  console.error('Error submitting inquiry:', error.message);
} else {
  console.log('Inquiry submitted successfully');
}
```

---

### Fetch All Inquiries (Admin Only)

```typescript
const { data, error } = await supabase
  .from('inquiries')
  .select('*')
  .order('created_at', { ascending: false });
```

**Filter by Status**:
```typescript
const { data, error } = await supabase
  .from('inquiries')
  .select('*')
  .eq('status', 'new')
  .order('created_at', { ascending: false });
```

---

### Update Inquiry Status (Admin Only)

```typescript
const { error } = await supabase
  .from('inquiries')
  .update({ status: 'contacted' })
  .eq('id', inquiryId);
```

**Valid statuses**: `'new'`, `'contacted'`, `'closed'`

---

## Quote Requests

### Submit Quote Request (Public)

Submit a quote request with optional attachments.

```typescript
// 1. Upload attachments (if any)
const attachmentUrls = [];
for (const file of attachmentFiles) {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('quote-attachments')
    .upload(`quotes/${fileName}`, file);
  
  if (!error) {
    const { data: { publicUrl } } = supabase.storage
      .from('quote-attachments')
      .getPublicUrl(`quotes/${fileName}`);
    attachmentUrls.push(publicUrl);
  }
}

// 2. Submit quote request
const { error } = await supabase
  .from('quote_requests')
  .insert({
    company: 'ABC Construction',
    contact_name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    product_interest: 'Portable Cabin 20ft',
    timeline: '1-3 months',
    budget_range: '$10,000 - $50,000',
    details: 'Need 5 units for construction site',
    attachments: attachmentUrls,
    product_id: productId // optional
  });
```

---

### Fetch All Quotes (Admin Only)

```typescript
const { data, error } = await supabase
  .from('quote_requests')
  .select('*, products(name)')
  .order('created_at', { ascending: false });
```

**Filter by Status**:
```typescript
const { data, error } = await supabase
  .from('quote_requests')
  .select('*')
  .eq('status', 'pending')
  .order('created_at', { ascending: false});
```

---

### Update Quote Status (Admin Only)

```typescript
const { error } = await supabase
  .from('quote_requests')
  .update({ status: 'quoted' })
  .eq('id', quoteId);
```

**Valid statuses**: `'pending'`, `'quoted'`, `'converted'`, `'closed'`

---

## Product Views

### Track Product View (Public)

Record a product page view for analytics.

```typescript
const { error } = await supabase
  .from('product_views')
  .insert({
    product_id: productId
  });

// Typically inserted without checking for errors
// to avoid blocking page load
```

---

### Get Top Viewed Products (Admin Only)

```typescript
// Get views from last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const { data, error } = await supabase
  .from('product_views')
  .select('product_id, products(id, name)')
  .gte('viewed_at', sevenDaysAgo.toISOString());

// Aggregate view counts
const productViewCounts = data.reduce((acc, view) => {
  const productId = view.product_id;
  acc[productId] = (acc[productId] || 0) + 1;
  return acc;
}, {});

// Sort by view count
const topProducts = Object.entries(productViewCounts)
  .map(([id, count]) => ({
    id,
    name: data.find(v => v.product_id === id)?.products?.name,
    views: count
  }))
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);
```

---

## Site Settings

### Get Site Settings (Public)

```typescript
const { data, error } = await supabase
  .from('site_settings')
  .select('*')
  .eq('key', 'company_info')
  .single();

if (data) {
  console.log('Company info:', data.value);
  // data.value = { name, email, phone, whatsapp, address }
}
```

---

### Update Site Settings (Admin Only)

```typescript
const { error } = await supabase
  .from('site_settings')
  .update({
    value: {
      name: 'MaxPrefabs',
      email: 'info@maxprefabs.com',
      phone: '+971 XX XXX XXXX',
      whatsapp: '+971 XX XXX XXXX',
      address: 'Dubai, UAE'
    }
  })
  .eq('key', 'company_info');
```

---

## Storage

### Upload File with Compression

Using the image optimization utility:

```typescript
import { compressAndUploadImage } from '@/lib/imageOptimization';

const url = await compressAndUploadImage(
  file,
  'product-images',
  'products'
);

console.log('Uploaded to:', url);
```

---

### Get Optimized Image URL

Using Supabase image transformations:

```typescript
import { getOptimizedImageUrl } from '@/lib/imageOptimization';

const optimizedUrl = getOptimizedImageUrl(originalUrl, {
  width: 800,
  height: 600,
  quality: 80
});
```

---

### Delete File from Storage

```typescript
const { error } = await supabase.storage
  .from('product-images')
  .remove(['products/filename.jpg']);

if (error) {
  console.error('Delete error:', error.message);
}
```

---

## Error Handling

All Supabase operations return an error object that should be checked:

```typescript
const { data, error } = await supabase.from('table').select();

if (error) {
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  console.error('Error details:', error.details);
  console.error('Error hint:', error.hint);
  
  // Handle specific errors
  if (error.code === '23505') {
    // Unique constraint violation
  } else if (error.code === '42P01') {
    // Table does not exist
  } else if (error.code === 'PGRST116') {
    // Row not found (single query)
  }
}
```

**Common Error Codes**:
- `23505`: Unique constraint violation
- `23503`: Foreign key violation
- `42P01`: Undefined table
- `42703`: Undefined column
- `PGRST116`: Not found (single query)
- `PGRST301`: Row-level security violation

---

## React Query Integration

The app uses `@tanstack/react-query` for data fetching. Custom hooks are available:

### Products
```typescript
import { useProducts, useProduct } from '@/hooks/useProducts';

// In component
const { data: products, isLoading, error } = useProducts('Portable Cabins');
const { data: product } = useProduct('portable-cabin-20ft');
```

### Projects
```typescript
import { useProjects } from '@/hooks/useProjects';

const { data: projects, isLoading } = useProjects('Residential');
```

### Inquiries
```typescript
import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';

const { data: inquiries } = useInquiries('new');
const updateStatus = useUpdateInquiryStatus();

// Update status
updateStatus.mutate({ id: inquiryId, status: 'contacted' });
```

### Quotes
```typescript
import { useQuotes, useUpdateQuoteStatus } from '@/hooks/useQuotes';

const { data: quotes } = useQuotes('pending');
const updateStatus = useUpdateQuoteStatus();

// Update status
updateStatus.mutate({ id: quoteId, status: 'quoted' });
```

---

## Realtime Subscriptions

### Subscribe to Table Changes

```typescript
const channel = supabase
  .channel('inquiries-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'inquiries'
    },
    (payload) => {
      console.log('New inquiry:', payload.new);
      // Handle new inquiry
    }
  )
  .subscribe();

// Unsubscribe when done
channel.unsubscribe();
```

**Events**: `INSERT`, `UPDATE`, `DELETE`, `*` (all)

---

## Rate Limiting

Best practices to avoid rate limits:

1. **Use React Query**: Automatic caching and deduplication
2. **Debounce Searches**: Don't query on every keystroke
3. **Batch Operations**: Group multiple updates
4. **Pagination**: Limit query results

```typescript
// Example: Paginated query
const { data, error } = await supabase
  .from('products')
  .select('*')
  .range(0, 9) // First 10 items (0-indexed)
  .order('created_at', { ascending: false });
```

---

*Last Updated: 2025*
*API Version: 1.0*
