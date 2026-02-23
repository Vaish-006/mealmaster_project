# Google Maps Integration Setup Guide

## Overview
The MealMaster application now includes Google Maps integration to display delivery locations for orders. This allows users to see their order locations and vendors to track delivery addresses on an interactive map.

## Features Implemented

### 1. User Dashboard
- Users can view their order details with a "View Details" button
- Order details modal displays:
  - Complete order information
  - Delivery period
  - Google Maps view of delivery location
  - Link to open location in Google Maps

### 2. Vendor Orders
- Vendors can see all orders for their subscriptions
- "View Map" button shows order details including:
  - Customer information
  - Delivery location on Google Maps
  - Direct link to navigate in Google Maps

### 3. Order Placement
- Automatically captures user's geolocation when placing an order
- Stores latitude and longitude in the database
- Location is sent to vendors for delivery tracking

## Setup Instructions

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key. **IMPORTANT:** A valid Google Maps API key usually starts with `AIzaSy`. If your key starts with something else, it might be the wrong type of key.
6. (Recommended) Restrict your API key:
   - Application restrictions: Set to "HTTP referrers"
   - Add your website URL (e.g., `http://localhost:*` for development)
   - API restrictions: Select "Maps JavaScript API"

### Step 2: Configure the API Key

Open the file: `/MealMaster/src/components/OrderMapView.jsx`

Find this line (around line 22):
```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```

Replace `'YOUR_GOOGLE_MAPS_API_KEY'` with your actual API key:
```javascript
const GOOGLE_MAPS_API_KEY = 'AIzaSyC...your-actual-key-here';
```

### Step 3: Environment Variables (Recommended for Production)

For production, it's better to use environment variables:

1. Create a `.env` file in the `/MealMaster` directory:
```bash
VITE_GOOGLE_MAPS_API_KEY=your-api-key-here
```

2. Update `OrderMapView.jsx`:
```javascript
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

3. Add `.env` to your `.gitignore` file to keep your API key secure

### Step 4: Database Migration

The backend has been updated to include `latitude` and `longitude` fields in the `orders` table. If you're using an existing database, you need to add these columns:

```sql
ALTER TABLE orders ADD COLUMN latitude DOUBLE;
ALTER TABLE orders ADD COLUMN longitude DOUBLE;
```

MySQL will automatically create these columns when you restart the Spring Boot application if you have `spring.jpa.hibernate.ddl-auto=update` in your `application.properties`.

## Testing the Integration

### Test Location Capture

1. Start the application
2. Log in as a user
3. Browse subscriptions and click on one
4. Click "Purchase"
5. You should see a toast notification: "Location detected successfully"
6. The browser will ask for location permissions - allow it
7. Complete the order

### Test User Dashboard

1. Go to User Dashboard
2. Click "View Details" on any order
3. You should see:
   - Order information
   - Google Maps with a marker at the delivery location
   - A link to open in Google Maps

### Test Vendor Orders

1. Log in as a vendor
2. Go to Vendor Orders
3. Click "View Map" on any order
4. You should see the delivery location on Google Maps

## Troubleshooting

### Map Shows a Warning "Location not available"

**Problem**: The vendor sees "Location not available" message.
**Solution**:
- This means the order was placed before the update or the location capture failed.
- Only **NEW** orders placed after this update will capture coordinates.
- Ensure the user allows location permissions when placing the order.
- Geolocation requires **HTTPS** on real servers (though `localhost` works for development).

### Map area is blank or shows API Error

**Problem**: The map container is there but blank or shows "Oops! Something went wrong".
**Solution**:
- Your API key might be invalid or restricted.
- Check if your key starts with `AIzaSy`.
- Ensure the **Maps JavaScript API** is enabled in your Google Cloud Project.
- Check the browser's console (F12 -> Console) for specific error messages from Google.
- If you see "RefererNotAllowedMapError", you need to fix your key restrictions in Google Cloud Console.

## Free Tier Limits

Google Maps API has a free tier with the following limits:
- **Maps JavaScript API**: $200 free credit per month
- This typically covers ~28,000 map loads per month
- Monitor your usage in Google Cloud Console

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for production
3. **Restrict API keys** in Google Cloud Console:
   - By HTTP referrer (domain)
   - By API (only enable required APIs)
4. **Monitor usage** to detect unusual activity
5. **Rotate keys** if compromised

## API Cost Optimization

To minimize costs:
1. Use `LoadScript` component (already implemented) - it prevents multiple script loads
2. Consider caching map instances
3. Set appropriate zoom levels
4. Only load maps when needed (in modals, as implemented)

## Browser Compatibility

The geolocation feature works on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Geolocation requires HTTPS in production (localhost is allowed for development)

## Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps API Library](https://react-google-maps-api-docs.netlify.app/)
- [Geolocation API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
