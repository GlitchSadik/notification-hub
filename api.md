# API Contract - Notification Hub

This document outlines the API endpoints for the Notification Hub system.

## 1. Create Notification
**Endpoint**: `POST /api/v1/notifications`

**Description**: Dispatches a new notification to all users or a specific set of roles.

### Request Schema
```json
{
  "title": "string",
  "message": "string",
  "role_ids": "array[integer]" (Optional: Empty means 'All')
}
```

### Realistic Example (Dhaka Branch Maintenance)
**Request**:
```json
{
  "title": "Server Maintenance: Banani DC",
  "message": "Routine maintenance scheduled for tonight. Budget approved: 5,000 BDT.",
  "role_ids": [1, 2]
}
```

**Response (200 OK)**:
```json
{
  "status": "sent"
}
```

### Error Responses
- **422 Unprocessable Entity**: Missing title or message.
- **500 Internal Server Error**: Database connection failure.

---

## 2. Get User Notifications
**Endpoint**: `GET /api/v1/notifications/{user_id}`

**Description**: Retrieves all notifications for a specific user in reverse chronological order.

### Response Schema
```json
[
  {
    "id": "integer",
    "title": "string",
    "message": "string",
    "created_at": "datetime",
    "is_read": "boolean"
  }
]
```

### Realistic Example
**Request**: `GET /api/v1/notifications/4`

**Response (200 OK)**:
```json
[
  {
    "id": 12,
    "title": "Monthly Performance Bonus",
    "message": "Your performance bonus of 15,000 BDT has been credited.",
    "created_at": "2026-05-04T10:00:00Z",
    "is_read": false
  }
]
```

---

## 3. Mark Notification as Read
**Endpoint**: `PATCH /api/v1/notifications/{notif_id}/read/{user_id}`

**Description**: Updates the status of a specific notification for a user.

### Response (200 OK)
```json
{
  "status": "updated"
}
```

### Error Responses
- **404 Not Found**: Notification or User mapping does not exist.
