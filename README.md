# API Documentation

> **[Full e-commerce flow — Frontend API Contract]**
> This document lists every backend API endpoint consumed by the frontend application.

---

## 📡 Base URL Configuration

| Variable              | Location     | Default                   |
| --------------------- | ------------ | ------------------------- |
| `NEXT_PUBLIC_API_URL` | `.env.local` | `https://api.example.com` |

All requests are made through the centralized Axios instance.

**Source:** [`src/services/axiosInstance.ts`](file:///c:/Users/mdran/Documents/Personal%20Work/2026/Full%20e-commerce%20flow/src/services/axiosInstance.ts)

### Authentication Header

All protected routes require a Bearer token:

```
Authorization: Bearer <token>
```

Token is read automatically from `localStorage` via the Axios request interceptor.

---

## 🔐 Auth Module

**Source:** `src/store/slices/authSlice.ts`

---

### 1. Login

| Field        | Value         |
| ------------ | ------------- |
| **Endpoint** | `/auth/login` |
| **Method**   | `POST`        |

**Request Body:**
| Field | Type | Notes |
|---|---|---|
| `identifier` | `string` | Email or phone number |
| `password` | `string` | User's password |

**Expected Response:**

```json
{ "token": "string", "user": { ... } }
```

---

### 2. Register

| Field        | Value            |
| ------------ | ---------------- |
| **Endpoint** | `/auth/register` |
| **Method**   | `POST`           |

**Request Body:**
| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Full name |
| `email` | `string` | Email address |
| `phone` | `string` | Mobile number |
| `password` | `string` | Should be min 6 chars |

**Expected Response:**

```json
{ "token": "string", "user": { ... } }
```

---

### 3. Forgot Password (Send OTP)

| Field        | Value                   |
| ------------ | ----------------------- |
| **Endpoint** | `/auth/forgot-password` |
| **Method**   | `POST`                  |

**Request Body:**
| Field | Type | Notes |
|---|---|---|
| `email` | `string` | Email or phone number used at registration |

---

### 4. Verify OTP

| Field        | Value              |
| ------------ | ------------------ |
| **Endpoint** | `/auth/verify-otp` |
| **Method**   | `POST`             |

**Request Body:**
| Field | Type | Notes |
|---|---|---|
| `email` | `string` | Email or phone used for OTP request |
| `otp` | `string` | 6-digit one-time password |

---

### 5. Reset Password

| Field        | Value                  |
| ------------ | ---------------------- |
| **Endpoint** | `/auth/reset-password` |
| **Method**   | `POST`                 |

**Request Body:**
| Field | Type | Notes |
|---|---|---|
| `email` | `string` | User's email/phone |
| `otp` | `string` | 6-digit verified OTP |
| `newPassword` | `string` | New password, min 6 chars |

---

## 👤 User Module

**Source:** `src/store/slices/userSlice.ts`

---

### 6. Get Profile

| Field             | Value                 |
| ----------------- | --------------------- |
| **Endpoint**      | `/user/profile`       |
| **Method**        | `GET`                 |
| **Auth Required** | ✅ Yes (Bearer token) |

No request body. Returns the logged-in user's profile data.

---

### 7. Update Profile

| Field             | Value                 |
| ----------------- | --------------------- |
| **Endpoint**      | `/user/profile`       |
| **Method**        | `PUT`                 |
| **Auth Required** | ✅ Yes (Bearer token) |

**Request Body:**
| Field | Type | Notes |
|---|---|---|
| `name` | `string` | _(optional)_ Updated full name |
| `email` | `string` | _(optional)_ Updated email |
| `phone` | `string` | _(optional)_ Updated phone number |
| `avatar` | `string` | _(optional)_ Profile image URL |

---

## 🛍️ Product Module

**Source:** `src/store/slices/productSlice.ts`

---

### 8. Get All Products

| Field        | Value       |
| ------------ | ----------- |
| **Endpoint** | `/products` |
| **Method**   | `GET`       |

**Query Parameters:**
| Param | Type | Notes |
|---|---|---|
| `?category` | `string` | _(optional)_ Filter by category slug (e.g. `panjabi`, `t-shirt`) |
| `?search` | `string` | _(optional)_ Search keyword to filter by product name |

**Example:** `GET /products?category=panjabi&search=eid`

---

### 9. Get Single Product

| Field        | Value           |
| ------------ | --------------- |
| **Endpoint** | `/products/:id` |
| **Method**   | `GET`           |

**Path Parameters:**
| Param | Type | Notes |
|---|---|---|
| `:id` | `string` | Unique product ID or slug |

---

## 📦 Order Module

**Source:** `src/store/slices/orderSlice.ts`

---

### 10. Place Order

| Field             | Value                 |
| ----------------- | --------------------- |
| **Endpoint**      | `/orders`             |
| **Method**        | `POST`                |
| **Auth Required** | ✅ Yes (Bearer token) |

**Request Body (orderData object):**
| Field | Type | Notes |
|---|---|---|
| `items` | `array` | Cart items — each with `productId`, `name`, `size`, `quantity`, `price` |
| `shippingAddress` | `object` | `firstName`, `lastName`, `streetAddress`, `city`, `district`, `phone`, `email` |
| `shippingCost` | `number` | `60` (inside Dhaka) or `120` (outside Dhaka) |
| `totalPrice` | `number` | Subtotal + shippingCost |
| `paymentMethod` | `string` | e.g. `"cash_on_delivery"` |
| `notes` | `string` | _(optional)_ Special delivery notes |

---

### 11. Get Order History

| Field             | Value                 |
| ----------------- | --------------------- |
| **Endpoint**      | `/orders`             |
| **Method**        | `GET`                 |
| **Auth Required** | ✅ Yes (Bearer token) |

Returns an array of the authenticated user's past orders.

---

## 📋 Summary Table

| #   | Feature            | Endpoint                      | Method | Auth |
| --- | ------------------ | ----------------------------- | ------ | ---- |
| 1   | Login              | `/auth/login`                 | POST   | ❌   |
| 2   | Register           | `/auth/register`              | POST   | ❌   |
| 3   | Forgot Password    | `/auth/forgot-password`       | POST   | ❌   |
| 4   | Verify OTP         | `/auth/verify-otp`            | POST   | ❌   |
| 5   | Reset Password     | `/auth/reset-password`        | POST   | ❌   |
| 6   | Get Profile        | `/user/profile`               | GET    | ✅   |
| 7   | Update Profile     | `/user/profile`               | PUT    | ✅   |
| 8   | Get Products       | `/products?category=&search=` | GET    | ❌   |
| 9   | Get Single Product | `/products/:id`               | GET    | ❌   |
| 10  | Place Order        | `/orders`                     | POST   | ✅   |
| 11  | Get Orders         | `/orders`                     | GET    | ✅   |
