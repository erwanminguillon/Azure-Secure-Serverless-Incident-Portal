# API Error Model

## Standard error envelope

All API errors should use this shape:

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred.",
    "details": [
      {
        "field": "title",
        "message": "Title is required."
      }
    ],
    "correlationId": "a8f6a5d4-b1b2-46d4-b0f3-8f02e96b3cd3"
  }
}

## Error codes
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
TRACKING_TOKEN_INVALID
CONFLICT
UNSUPPORTED_FILE_TYPE
FILE_TOO_LARGE
INTERNAL_ERROR

## HTTP Status errors
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
413 Payload Too Large
415 Unsupported Media Type
500 Internal Server Error


## Example  
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred.",
    "details": [
      {
        "field": "title",
        "message": "Title is required."
      }
    ],
    "correlationId": "example-correlation-id"
  }
}