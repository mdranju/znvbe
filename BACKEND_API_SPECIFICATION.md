# Backend API Specification — ZNVBE

This document provides a comprehensive blueprint for the backend API required to support the ZNVBE frontend application.

---

## 🛰️ General Information

### Base URL
`https://api.znvbe.com/v1`

### Default Headers
- `Content-Type: application/json`
- `Accept: application/json`

### Authentication
All protected endpoints require a Bearer Token:
`Authorization: Bearer <your_access_token>`

---

## 🔐 1. Authentication Module

### 1.1 Login
- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Purpose:** Authenticate user and return token.
- **Request Body:**
  ```json
  {
    "identifier": "user@example.com", // Email or phone number
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+8801700000000",
      "role": "customer"
    }
  }
  ```

### 1.2 Register
- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Purpose:** Create a new user account.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+8801700000000",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "user-123", "...": "..." }
  }
  ```

### 1.3 Forgot Password
- **Endpoint:** `/auth/forgot-password`
- **Method:** `POST`
- **Purpose:** Send OTP to email/phone for password reset.
- **Request Body:**
  ```json
  { "email": "jane@example.com" }
  ```

### 1.4 Verify OTP
- **Endpoint:** `/auth/verify-otp`
- **Method:** `POST`
- **Purpose:** Validate the OTP sent to user.
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "otp": "123456"
  }
  ```

### 1.5 Reset Password
- **Endpoint:** `/auth/reset-password`
- **Method:** `POST`
- **Purpose:** Set a new password using a verified OTP.
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "otp": "123456",
    "newPassword": "newsecurepassword456"
  }
  ```

---

## 🛍️ 2. Product Module

### 2.1 Get All Products
- **Endpoint:** `/products`
- **Method:** `GET`
- **Query Params:**
  - `category` (string): Slug of the category.
  - `search` (string): Search term.
  - `sort` (string): `price_asc`, `price_desc`, `newest`.
  - `page` (number): Pagination.
- **Response:**
  ```json
  {
    "products": [
      {
        "id": "prod-1",
        "name": "Premium Panjabi",
        "slug": "premium-panjabi",
        "price": 2500,
        "originalPrice": 3000,
        "images": ["url1", "url2"],
        "category": "panjabi",
        "stock": 10
      }
    ],
    "total": 100,
    "page": 1
  }
  ```

### 2.2 Get Single Product
- **Endpoint:** `/products/:id_or_slug`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": "prod-1",
    "name": "Premium Panjabi",
    "description": "High quality fabric...",
    "price": 2500,
    "sizes": ["M", "L", "XL"],
    "colors": ["White", "Black"],
    "stock": { "M": 5, "L": 3, "XL": 2 },
    "images": ["..."]
  }
  ```

### 2.3 Get Categories
- **Endpoint:** `/categories`
- **Method:** `GET`
- **Purpose:** Fetch list of product categories (Panjabi, T-shirt, etc.)
- **Response:**
  ```json
  [
    { "id": "cat-1", "name": "Panjabi", "slug": "panjabi", "image": "..." },
    { "id": "cat-2", "name": "T-shirt", "slug": "t-shirt", "image": "..." }
  ]
  ```

---

## 📦 3. Order Module

### 3.1 Place Order
- **Endpoint:** `/orders`
- **Method:** `POST`
- **Auth Required:** ✅
- **Request Body:**
  ```json
  {
    "items": [
      { "productId": "prod-1", "quantity": 1, "size": "L", "color": "Black" }
    ],
    "shippingAddress": {
      "firstName": "Jane",
      "lastName": "Doe",
      "street": "123 Road",
      "city": "Dhaka",
      "district": "Dhaka",
      "phone": "+8801700000000"
    },
    "paymentMethod": "cash_on_delivery",
    "shippingCost": 60,
    "totalPrice": 2560,
    "notes": "Deliver after 5 PM"
  }
  ```

### 3.2 Get Order History
- **Endpoint:** `/orders`
- **Method:** `GET`
- **Auth Required:** ✅
- **Response:**
  ```json
  [
    {
      "orderId": "ORD-12345",
      "status": "pending",
      "total": 2560,
      "date": "2024-04-08T10:00:00Z",
      "items": [...]
    }
  ]
  ```

### 3.3 Track Order
- **Endpoint:** `/orders/track`
- **Method:** `GET`
- **Purpose:** Publicly track order status without login.
- **Query Params:**
  - `orderId` (string)
  - `email` (string)
- **Response:**
  ```json
  {
    "orderId": "ORD-12345",
    "status": "shipped",
    "trackingSteps": [
      { "status": "Order Placed", "date": "...", "completed": true },
      { "status": "Shipped", "date": "...", "completed": true },
      { "status": "Out for Delivery", "date": null, "completed": false }
    ]
  }
  ```

---

## 👤 4. User Module

### 4.1 Get Profile
- **Endpoint:** `/user/profile`
- **Method:** `GET`
- **Auth Required:** ✅

### 4.2 Update Profile
- **Endpoint:** `/user/profile`
- **Method:** `PUT`
- **Auth Required:** ✅
- **Request Body:**
  ```json
  {
    "name": "Jane Update",
    "phone": "+8801711111111"
  }
  ```

### 4.3 Get Addresses
- **Endpoint:** `/user/addresses`
- **Method:** `GET`
- **Auth Required:** ✅

### 4.4 Add Address
- **Endpoint:** `/user/addresses`
- **Method:** `POST`
- **Auth Required:** ✅
- **Request Body:**
  ```json
  {
    "label": "Office",
    "firstName": "Jane",
    "lastName": "Doe",
    "street": "456 Corporate Ave",
    "city": "Dhaka",
    "district": "Dhaka",
    "phone": "...",
    "isDefault": false
  }
  ```

---

## 🏗️ Data Models (Entities)

### User
| Field | Type | Description |
|---|---|---|
| `id` | UUID/String | Unique identifier |
| `name` | String | Full name |
| `email` | String | Unique email |
| `phone` | String | Contact number |
| `password` | String | Hashed password |
| `role` | Enum | `customer`, `admin` |

### Product
| Field | Type | Description |
|---|---|---|
| `id` | UUID/String | Unique identifier |
| `name` | String | Product title |
| `slug` | String | URL friendly name |
| `price` | Decimal | Current price |
| `originalPrice` | Decimal | Price before discount |
| `images` | Array | URLs of images |
| `category` | String/Ref | Category association |
| `sizes` | Array | Available sizes (S, M, L, etc.) |
| `stock` | Map | Size-to-quantity mapping |

### Order
| Field | Type | Description |
|---|---|---|
| `id` | UUID/String | External Order ID (ORD-XXXX) |
| `userId` | Ref | Reference to User |
| `status` | Enum | `pending`, `confirmed`, `shipped`, `delivered`, `cancelled` |
| `total` | Decimal | Final price |
| `items` | Array | Objects with `productId`, `qty`, `size`, `price` |
| `address` | Object | Snapshot of shipping details |

---

## ⚠️ Error Responses

All errors should follow this structure:

```json
{
  "status": "error",
  "message": "Detailed error message here",
  "code": "AUTH_FAILED" // Optional error code for frontend handling
}
```

Common status codes:
- `400`: Bad Request (Validation errors)
- `401`: Unauthorized (Missing/Invalid Token)
- `403`: Forbidden (Insufficient Permissions)
- `404`: Not Found (Product/Order not found)
- `500`: Internal Server Error
