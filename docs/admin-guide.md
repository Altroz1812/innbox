# MaxPrefabs Admin Panel User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Products](#managing-products)
4. [Managing Gallery](#managing-gallery)
5. [Handling Inquiries](#handling-inquiries)
6. [Processing Quote Requests](#processing-quote-requests)
7. [Settings & Configuration](#settings--configuration)

---

## 1. Getting Started

### Accessing the Admin Panel
- Navigate to: `https://yoursite.com/auth`
- Login with your admin credentials (email and password)
- Once logged in, you'll be redirected to the admin dashboard

### First Time Setup
1. Go to Settings page
2. Update company information
3. Configure email notification preferences
4. Review admin users

---

## 2. Dashboard Overview

The dashboard provides a comprehensive view of your site's activity:

### Statistics Cards
- **Products**: Total number of products in your catalog
- **Projects**: Total gallery images uploaded
- **Inquiries**: Contact form submissions (with trend indicator)
- **Quotes**: Quote requests received (with trend indicator)

### Trend Indicators
- 📈 Green up arrow: Increased activity compared to previous week
- 📉 Red down arrow: Decreased activity compared to previous week
- Percentage shows the change rate

### Most Viewed Products
- Shows top 5 products by page views in the last 7 days
- Helps identify popular products
- Use this data to optimize inventory and marketing

### Recent Submissions
- **Recent Inquiries**: Last 5 contact form submissions
- **Recent Quote Requests**: Last 5 quote requests
- Color-coded status badges for quick identification

### Quick Actions
- Direct links to filtered views:
  - View New Inquiries (status: new)
  - Pending Quotes (status: pending)
  - Add Product
  - Upload Gallery Images

---

## 3. Managing Products

### Adding a New Product

1. Click **"Add Product"** button in Products page
2. Fill in the following details:
   - **Name** (required): Product name
   - **Category** (required): Select from dropdown
   - **Short Description** (optional): Brief overview
   - **Full Description** (optional): Detailed information
3. Add **Features**:
   - Click "Add Feature" button
   - Enter feature text
   - Repeat for multiple features
4. Add **Specifications**:
   - Click "Add Specification" button
   - Enter label (e.g., "Dimensions")
   - Enter value (e.g., "20ft x 8ft")
   - Repeat for multiple specs
5. Click **"Save"** to create the product

### Uploading Product Images

1. Find your product in the Products list
2. Click the **"Images"** button
3. Upload images:
   - Drag & drop images into the upload zone
   - Or click to browse and select files
4. Set **Primary Image**:
   - Toggle the "Primary" switch on your preferred thumbnail
   - This image will be used in product listings
5. **Reorder Images**:
   - Drag and drop image cards to change order
   - Order determines display sequence on product page
6. Click **"Save"** to apply changes

### Editing Products

1. Click **"Edit"** button on product card
2. Update any fields as needed
3. Click **"Save"** to apply changes

### Deleting Products

1. Click the **trash icon** on product card
2. Confirm deletion in the popup
3. **Note**: All product images will be permanently deleted

### Searching and Filtering

- **Search Bar**: Type product name to filter results
- **Category Dropdown**: Filter products by category
- Both filters can be used simultaneously

---

## 4. Managing Gallery

### Adding Project Images

1. Navigate to **"Gallery"** in sidebar
2. Click **"Add Image"** button
3. Fill in details:
   - **Upload Image**: Choose file from computer
   - **Title** (required): Project name or description
   - **Description** (optional): Additional details
   - **Category** (required): Select project type
     - Residential
     - Commercial
     - Industrial
     - Institutional
4. Click **"Save"**

### Filtering Gallery

- Use the **Category dropdown** to view specific project types
- Select "All Categories" to view everything

### Editing Gallery Images

1. Hover over an image card
2. Click the **"Edit"** button in the overlay
3. Update title, description, or category
4. Click **"Save"**

### Deleting Gallery Images

1. Hover over an image card
2. Click the **"Delete"** button in the overlay
3. Confirm deletion
4. Image will be removed from storage and database

---

## 5. Handling Inquiries

### Viewing Inquiries

The Inquiries page displays all contact form submissions in a table:

- **Name**: Customer name
- **Email**: Contact email
- **Type**: Inquiry category selected by customer
- **Status**: Current inquiry status
- **Date**: Submission date
- **Actions**: Status management dropdown

### Status Workflow

Use the dropdown in the Actions column to update status:

1. **New** (Blue badge)
   - Initial status when inquiry is submitted
   - Indicates no action taken yet

2. **Contacted** (Yellow badge)
   - Mark as contacted after you respond to the customer
   - Shows inquiry is being handled

3. **Closed** (Gray badge)
   - Mark as closed after resolution
   - Use when inquiry is fully addressed

### Best Practices

- **Respond Promptly**: Check for new inquiries daily
- **Update Status**: Always update status after each interaction
- **Follow Up**: For complex inquiries, follow up to ensure satisfaction
- **Export Regularly**: Use Settings > Backup & Export to download inquiry data

### Filtering Inquiries

- Use Quick Actions on Dashboard: "View New Inquiries" (filters status=new)
- Or manually filter in the Inquiries page

---

## 6. Processing Quote Requests

### Viewing Quote Requests

The Quotes page displays all quote requests in a table:

- **Contact**: Customer name
- **Email**: Contact email
- **Company**: Business name (if provided)
- **Product**: Product of interest
- **Status**: Current quote status
- **Date**: Request date
- **Actions**: Status management dropdown

### Status Workflow

Update quote status through the lifecycle:

1. **Pending** (Blue badge)
   - New quote request received
   - Awaiting review and pricing

2. **Quoted** (Yellow badge)
   - Price quote has been sent to customer
   - Awaiting customer response

3. **Converted** (Green badge)
   - Customer accepted the quote
   - Order confirmed or in progress

4. **Closed** (Gray badge)
   - Quote rejected, expired, or completed
   - No further action needed

### Quote Details

Each quote includes:
- Company name
- Contact person
- Email and phone
- Product interest
- Timeline requirements
- Budget range
- Additional details/requirements
- File attachments (if any)

### Processing Workflow

1. **Review Request**: Read all details and attachments
2. **Prepare Quote**: Calculate pricing based on requirements
3. **Contact Customer**: Send quote via email or phone
4. **Update Status to "Quoted"**: Track that quote was sent
5. **Follow Up**: Check in after a few days
6. **Update Final Status**: Mark as "Converted" or "Closed"

### Downloading Attachments

If customer uploaded files (plans, drawings):
- Attachments are listed in the quote details
- Click to download and review

---

## 7. Settings & Configuration

### Company Information

Update details displayed on your website:

- **Company Name**: Business name
- **Email**: Contact email address
- **Phone**: Primary phone number
- **WhatsApp**: WhatsApp business number
- **Address**: Business address

**Important**: Click "Save Changes" at top right after updates

### Email Notifications

Configure automated notifications:

- **Recipient Email**: Where notifications are sent
- **New Inquiry Notifications**: Toggle on/off
  - Receive email when contact form is submitted
- **New Quote Request Notifications**: Toggle on/off
  - Receive email when quote is requested

**Note**: Email notifications require additional configuration via Edge Functions

### Admin Users

View all users with administrator access:

- Lists user IDs and roles
- Shows who can access the admin panel
- Future versions will allow adding/removing admins

### Backup & Export

Download your data as JSON files for backup:

- **Export Products**: All product data with details
- **Export Projects**: All gallery images metadata
- **Export Inquiries**: All contact form submissions
- **Export Quotes**: All quote requests

**Best Practice**: Export data regularly for backup purposes

---

## Tips & Best Practices

### Daily Tasks
- [ ] Check Dashboard for new inquiries and quotes
- [ ] Respond to new inquiries (mark as contacted)
- [ ] Follow up on pending quotes
- [ ] Review most viewed products

### Weekly Tasks
- [ ] Review and update quote statuses
- [ ] Close resolved inquiries
- [ ] Add new products if available
- [ ] Update gallery with recent projects
- [ ] Export data for backup

### Monthly Tasks
- [ ] Review admin user access
- [ ] Update company information if changed
- [ ] Analyze trends in inquiries and quotes
- [ ] Optimize popular products based on view data

---

## Troubleshooting

### Can't Upload Images
- Check file size (max 5MB)
- Ensure file format is JPG, PNG, or WebP
- Clear browser cache and try again

### Status Not Updating
- Check internet connection
- Refresh the page
- Ensure you're still logged in

### Missing Data
- Verify you're filtering correctly
- Check if data was accidentally deleted
- Restore from backup export if needed

---

## Support

For technical support or questions:
- Email: support@maxprefabs.com
- Check documentation in `/docs` folder
- Review database schema in `database-schema.md`

---

*Last Updated: 2025*
