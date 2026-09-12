# API Setup Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format
All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {...}
}
```

## Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting
- No rate limiting currently implemented
- Recommended: 100 requests per minute per IP

## Pagination
List endpoints support pagination:
```
GET /api/products?page=1&limit=12
```

Response includes:
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 9
  }
}
```

## Filtering

### Products Filtering
```
GET /api/products?category=Tires&minPrice=50&maxPrice=200&search=michelin
```

### Parameters
- `category` - Product category (Tires, Batteries, Oils)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search term (searches in name and description)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12, max: 100)

## Error Handling

Common error messages:

| Error | Description |
|-------|-------------|
| Invalid credentials | Email or password is incorrect |
| User already exists | Email is already registered |
| Product not found | Product ID doesn't exist |
| Cart is empty | Cannot proceed with empty cart |
| Invalid coupon | Coupon code is invalid or expired |
| Insufficient stock | Not enough items in stock |
| Payment failed | Transaction was declined |

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products?category=Tires&limit=5
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart/{userId}/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "productId": "product_id",
    "quantity": 1
  }'
```

## Webhook Events

### Payment Webhook (Stripe)
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

### Order Webhook
- `order.created` - New order created
- `order.updated` - Order status changed
- `order.cancelled` - Order cancelled

## Rate Limits (Recommended)
- Authentication endpoints: 10 requests/minute
- Payment endpoints: 5 requests/minute
- General endpoints: 100 requests/minute

## API Versioning
Current API version: v1
Future versions may use:
```
/api/v2/...
```

## CORS Configuration
Allowed origins:
- http://localhost:3000 (development)
- http://localhost:5000 (development)
- Production domain (to be configured)

## Performance Optimization

### Database Indexes
- Indexed fields for faster queries:
  - User: email
  - Product: category, sku
  - Order: userId, orderStatus
  - Payment: orderId, transactionId

### Caching Recommendations
- Product listings: Cache for 5 minutes
- User data: Cache for 1 hour
- Product details: Cache for 1 hour
- Cart: No caching (real-time)

## Troubleshooting

### Common Issues

**Issue**: 401 Unauthorized
- **Solution**: Ensure token is included in Authorization header

**Issue**: 404 Not Found
- **Solution**: Check endpoint URL and resource ID

**Issue**: 500 Internal Server Error
- **Solution**: Check server logs and MongoDB connection

**Issue**: CORS Error
- **Solution**: Ensure frontend URL is in CORS whitelist

## Best Practices

1. Always validate input on client-side before sending
2. Store tokens securely (preferably in httpOnly cookies)
3. Implement request timeout (recommended: 30 seconds)
4. Retry failed requests with exponential backoff
5. Log all API calls for debugging
6. Use HTTPS in production
7. Implement rate limiting on client-side
8. Cache frequently accessed data

## API Changelog

### v1.0.0 (Current)
- Initial release
- Authentication system
- Product management
- Shopping cart
- Orders and payments
- Admin functionality
