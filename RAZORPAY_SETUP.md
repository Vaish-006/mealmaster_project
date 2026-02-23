# Razorpay Payment Gateway Setup Instructions

## Backend Setup

1. **Update Razorpay Credentials**
   - Open `mealmaster-backend/src/main/resources/application.properties`
   - Replace the placeholder values with your actual Razorpay credentials:
   ```properties
   razorpay.key.id=your_actual_razorpay_key_id
   razorpay.key.secret=your_actual_razorpay_key_secret
   ```

2. **Get Razorpay Credentials**
   - Sign up at https://razorpay.com/
   - Go to Dashboard → Settings → API Keys
   - Generate Test/Live API Keys
   - Copy Key ID and Key Secret

3. **Rebuild Backend**
   ```bash
   cd mealmaster-backend
   mvn clean install
   mvn spring-boot:run
   ```

## Frontend Setup

No additional setup required. The Razorpay checkout script is loaded dynamically.

## Features Implemented

1. **Razorpay Payment Gateway Integration**
   - Secure payment processing
   - Payment verification with signature validation
   - Real-time payment status updates

2. **Automatic Receipt Generation**
   - Payment receipt automatically downloads after successful payment
   - Contains order details, payment ID, and subscription information

3. **Subscription Plan Download**
   - Receipt includes complete subscription plan details
   - Downloadable as text file with order reference

4. **Error Handling**
   - Payment failure handling
   - Network error recovery
   - User-friendly error messages

## Testing

1. Use Razorpay test credentials for development
2. Test with Razorpay test card numbers:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

## Security Features

- Payment signature verification
- Secure API key handling
- Order validation before payment
- Payment status tracking