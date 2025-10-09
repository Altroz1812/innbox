# MaxPrefabs Database Schema Documentation

## Overview

This document describes the complete database structure for the MaxPrefabs application, including all tables, columns, relationships, RLS policies, functions, and storage buckets.

---

## Tables

### 1. user_roles

**Purpose**: Manages administrator access control for the system.

**Columns**:
- `id` (uuid, PRIMARY KEY) - Unique identifier
- `user_id` (uuid, FOREIGN KEY → auth.users) - Reference to authenticated user
- `role` (app_role enum) - User role: 'admin' or 'user'
- `created_at` (timestamptz) - Record creation timestamp

**RLS Policies**:
- **Admins can view all roles** (SELECT): `has_role(auth.uid(), 'admin')`
- **Admins can insert roles** (INSERT): `has_role(auth.uid(), 'admin')`
- **Admins can delete roles** (DELETE): `has_role(auth.uid(), 'admin')`

**Indexes**:
- Primary key on `id`
- Unique constraint on `(user_id, role)` combination

**Notes**:
- Uses security definer function `has_role()` to prevent RLS recursion
- Critical for controlling admin panel access

---

### 2. products

**Purpose**: Stores the product catalog with all product information.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique product identifier
- `name` (text, NOT NULL) - Product name
- `slug` (text, UNIQUE, NOT NULL) - URL-friendly identifier
- `category` (text, NOT NULL) - Product category name
- `category_slug` (text, NOT NULL) - URL-friendly category identifier
- `short_description` (text) - Brief product overview
- `description` (text) - Detailed product description
- `features` (jsonb, DEFAULT '[]') - Array of product features
  - Example: `["Feature 1", "Feature 2"]`
- `specifications` (jsonb, DEFAULT '[]') - Array of specification objects
  - Example: `[{"label": "Dimension", "value": "20ft x 8ft"}]`
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp
- `updated_at` (timestamptz, DEFAULT now()) - Last update timestamp

**RLS Policies**:
- **Public can view products** (SELECT): `true` (anyone can view)
- **Admins can insert products** (INSERT): `has_role(auth.uid(), 'admin')`
- **Admins can update products** (UPDATE): `has_role(auth.uid(), 'admin')`
- **Admins can delete products** (DELETE): `has_role(auth.uid(), 'admin')`

**Triggers**:
- `update_products_updated_at`: Automatically updates `updated_at` on row update

**Relationships**:
- One-to-many with `product_images`
- One-to-many with `quote_requests` (optional)
- One-to-many with `product_views`

---

### 3. product_images

**Purpose**: Manages product image gallery with ordering and primary image selection.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique identifier
- `product_id` (uuid, FOREIGN KEY → products, NOT NULL) - Reference to product
- `image_url` (text, NOT NULL) - Full URL to image in storage
- `is_primary` (boolean, DEFAULT false) - Whether this is the main product image
- `display_order` (integer, DEFAULT 0) - Order for displaying images
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp

**RLS Policies**:
- **Public can view product images** (SELECT): `true`
- **Admins can insert product images** (INSERT): `has_role(auth.uid(), 'admin')`
- **Admins can update product images** (UPDATE): `has_role(auth.uid(), 'admin')`
- **Admins can delete product images** (DELETE): `has_role(auth.uid(), 'admin')`

**Foreign Keys**:
- `product_id` → `products(id)` ON DELETE CASCADE

**Indexes**:
- Primary key on `id`
- Index on `product_id` for faster joins

**Notes**:
- Cascades delete when parent product is deleted
- Only one image should have `is_primary = true` per product

---

### 4. project_images

**Purpose**: Stores gallery images for completed projects.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique identifier
- `title` (text, NOT NULL) - Project title
- `description` (text) - Project description
- `category` (project_category enum, NOT NULL) - Project type
  - Values: 'Residential', 'Commercial', 'Industrial', 'Institutional'
- `image_url` (text, NOT NULL) - Full URL to image in storage
- `display_order` (integer, DEFAULT 0) - Order for displaying images
- `created_at` (timestamptz, DEFAULT now()) - Creation timestamp

**RLS Policies**:
- **Public can view project images** (SELECT): `true`
- **Admins can insert project images** (INSERT): `has_role(auth.uid(), 'admin')`
- **Admins can update project images** (UPDATE): `has_role(auth.uid(), 'admin')`
- **Admins can delete project images** (DELETE): `has_role(auth.uid(), 'admin')`

**Indexes**:
- Primary key on `id`
- Index on `category` for filtering
- Index on `display_order` for sorting

---

### 5. inquiries

**Purpose**: Stores contact form submissions from website visitors.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique identifier
- `name` (text, NOT NULL) - Customer name
- `email` (text, NOT NULL) - Customer email
- `phone` (text) - Customer phone number
- `inquiry_type` (text, NOT NULL) - Type of inquiry
- `message` (text, NOT NULL) - Inquiry message
- `status` (inquiry_status enum, DEFAULT 'new') - Inquiry status
  - Values: 'new', 'contacted', 'closed'
- `created_at` (timestamptz, DEFAULT now()) - Submission timestamp

**RLS Policies**:
- **Anyone can submit inquiries** (INSERT): `true`
- **Admins can view inquiries** (SELECT): `has_role(auth.uid(), 'admin')`
- **Admins can update inquiries** (UPDATE): `has_role(auth.uid(), 'admin')`

**Indexes**:
- Primary key on `id`
- Index on `status` for filtering
- Index on `created_at` for sorting

**Notes**:
- Public can only INSERT (submit)
- Only admins can view and manage inquiries
- No DELETE policy (inquiries should be archived, not deleted)

---

### 6. quote_requests

**Purpose**: Stores quote request submissions from potential customers.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique identifier
- `company` (text) - Company name
- `contact_name` (text, NOT NULL) - Contact person name
- `email` (text, NOT NULL) - Contact email
- `phone` (text) - Contact phone number
- `product_interest` (text) - Product they're interested in
- `timeline` (text) - Project timeline
- `budget_range` (text) - Budget range
- `details` (text) - Additional details/requirements
- `attachments` (jsonb, DEFAULT '[]') - Array of attachment URLs
  - Example: `["url1", "url2"]`
- `status` (quote_status enum, DEFAULT 'pending') - Quote status
  - Values: 'pending', 'quoted', 'converted', 'closed'
- `product_id` (uuid, FOREIGN KEY → products) - Optional product reference
- `created_at` (timestamptz, DEFAULT now()) - Submission timestamp

**RLS Policies**:
- **Anyone can submit quote requests** (INSERT): `true`
- **Admins can view quote requests** (SELECT): `has_role(auth.uid(), 'admin')`
- **Admins can update quote requests** (UPDATE): `has_role(auth.uid(), 'admin')`

**Foreign Keys**:
- `product_id` → `products(id)` ON DELETE SET NULL

**Indexes**:
- Primary key on `id`
- Index on `status` for filtering
- Index on `created_at` for sorting
- Index on `product_id` for joins

**Notes**:
- Attachments stored in `quote-attachments` bucket
- Product reference is optional (for quotes from product pages)

---

### 7. product_views

**Purpose**: Tracks product page views for analytics.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique identifier
- `product_id` (uuid, FOREIGN KEY → products, NOT NULL) - Reference to product
- `viewed_at` (timestamptz, DEFAULT now(), NOT NULL) - View timestamp

**RLS Policies**:
- **Anyone can insert product views** (INSERT): `true`
- **Admins can view product views** (SELECT): `has_role(auth.uid(), 'admin')`

**Foreign Keys**:
- `product_id` → `products(id)` ON DELETE CASCADE

**Indexes**:
- Primary key on `id`
- Index on `product_id` for aggregations
- Index on `viewed_at DESC` for recent views

**Notes**:
- New record created each time a product page is viewed
- Used for analytics and "Most Viewed Products" feature
- Cascade deletes when product is removed

---

### 8. site_settings

**Purpose**: Stores site-wide configuration as key-value pairs.

**Columns**:
- `id` (uuid, PRIMARY KEY, DEFAULT gen_random_uuid()) - Unique identifier
- `key` (text, UNIQUE, NOT NULL) - Setting key/name
- `value` (jsonb, NOT NULL) - Setting value (flexible structure)
- `updated_at` (timestamptz, DEFAULT now(), NOT NULL) - Last update timestamp

**RLS Policies**:
- **Anyone can view site settings** (SELECT): `true`
- **Admins can manage site settings** (ALL): `has_role(auth.uid(), 'admin')`

**Triggers**:
- `update_site_settings_updated_at`: Updates `updated_at` on row update

**Indexes**:
- Primary key on `id`
- Unique index on `key`

**Default Settings**:

```json
{
  "company_info": {
    "name": "MaxPrefabs",
    "email": "info@maxprefabs.com",
    "phone": "+971 XX XXX XXXX",
    "whatsapp": "+971 XX XXX XXXX",
    "address": "Dubai, UAE"
  },
  "email_notifications": {
    "inquiry_enabled": true,
    "quote_enabled": true,
    "recipient_email": "admin@maxprefabs.com"
  }
}
```

**Notes**:
- Flexible JSONB structure allows adding new settings without schema changes
- Public read access for displaying company info on website

---

## Enums

### app_role
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
```
Used in `user_roles` table to define user permissions.

### inquiry_status
```sql
CREATE TYPE public.inquiry_status AS ENUM ('new', 'contacted', 'closed');
```
Tracks the lifecycle of customer inquiries.

### quote_status
```sql
CREATE TYPE public.quote_status AS ENUM ('pending', 'quoted', 'converted', 'closed');
```
Tracks the quote request workflow.

### project_category
```sql
CREATE TYPE public.project_category AS ENUM ('Residential', 'Commercial', 'Industrial', 'Institutional');
```
Categorizes project gallery images.

---

## Functions

### has_role(user_id, role)

**Purpose**: Security definer function to check if a user has a specific role.

**Definition**:
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

**Parameters**:
- `_user_id` (uuid): User ID to check
- `_role` (app_role): Role to verify

**Returns**: boolean - true if user has the role

**Security**: SECURITY DEFINER to avoid RLS recursion

**Usage in RLS**:
```sql
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
```

### update_updated_at_column()

**Purpose**: Trigger function to automatically update `updated_at` timestamp.

**Definition**:
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

**Usage**:
Applied to tables with `updated_at` column:
- `products`
- `site_settings`

---

## Storage Buckets

### 1. product-images

**Configuration**:
- **Public**: Yes (anyone can view)
- **Max File Size**: 5MB
- **Allowed Types**: image/jpeg, image/png, image/webp

**RLS Policies**:
```sql
-- Anyone can view product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Admins can upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);
```

**Path Structure**:
- `products/{filename}` - Product images

---

### 2. project-images

**Configuration**:
- **Public**: Yes (anyone can view)
- **Max File Size**: 5MB
- **Allowed Types**: image/jpeg, image/png, image/webp

**RLS Policies**:
Similar to product-images bucket

**Path Structure**:
- `gallery/{filename}` - Project gallery images

---

### 3. quote-attachments

**Configuration**:
- **Public**: No (admin-only access)
- **Max File Size**: 10MB
- **Allowed Types**: PDF, DWG, images

**RLS Policies**:
```sql
-- Only admins can view attachments
CREATE POLICY "Admins can view attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'quote-attachments' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Anyone can upload attachments (when submitting quote)
CREATE POLICY "Anyone can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quote-attachments');

-- Admins can delete attachments
CREATE POLICY "Admins can delete attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'quote-attachments' AND
  has_role(auth.uid(), 'admin'::app_role)
);
```

**Path Structure**:
- `quotes/{quote_id}/{filename}` - Quote attachments

---

## Relationships Diagram

```
auth.users (Supabase Auth)
    ↓
user_roles (admin access)

products
    ↓ (one-to-many)
    ├── product_images
    ├── product_views
    └── quote_requests (optional)

project_images (standalone)

inquiries (standalone)

quote_requests
    └→ products (optional)

site_settings (standalone)
```

---

## Security Best Practices

1. **RLS Enabled**: All tables have RLS enabled
2. **Admin-Only Mutations**: All data modifications require admin role
3. **Public Reads**: Product and project data is publicly readable
4. **Private Submissions**: Inquiries and quotes visible only to admins
5. **Security Definer**: Uses `has_role()` function to avoid RLS recursion
6. **Cascade Deletes**: Properly configured to maintain referential integrity

---

## Performance Optimizations

1. **Indexes**:
   - Primary keys on all tables
   - Foreign key indexes for joins
   - Status columns for filtering
   - Timestamp columns for sorting

2. **JSONB Usage**:
   - `features` and `specifications` in products
   - `attachments` in quote_requests
   - `value` in site_settings
   - Allows flexible schema without migrations

3. **Cascade Deletes**:
   - Product images deleted with product
   - Product views deleted with product
   - Reduces orphaned records

---

## Migration History

All migrations are located in `supabase/migrations/` directory.

Key migrations:
1. Initial schema setup (products, images, roles)
2. Inquiries and quotes tables
3. Product views and site settings (Phase 7)

---

## Backup Strategy

Regular backups can be created using:
1. Admin panel: Settings > Backup & Export
2. Supabase dashboard: Database > Backups
3. SQL dumps: `pg_dump` command

Recommended backup frequency:
- Daily: Automated database backups
- Weekly: Manual data exports via admin panel
- Before major updates: Full backup

---

*Last Updated: 2025*
*Schema Version: 1.2*
