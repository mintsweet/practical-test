# Backend

## Overview

The backend of this project is built with **NestJS** for rapid development and scalability. It includes the following key components:

- **OCR Microservice**: Handles optical character recognition for uploaded images.
- **API Endpoint**: Provides an `upload-and-extract` endpoint to upload images and extract content.
- **Static File Service**: Stores uploaded files locally and serves them via a static file server.

## Features

- **Microservice Architecture**: Modular design with an independent OCR microservice.
- **File Upload**: Allows users to upload images for OCR processing.
- **Static File Access**: Uploaded files are stored locally and can be accessed directly through a static server.

## Project Structure

```
backend/
├── src/                    # Source code
│   ├── ocr/                # OCR microservice
│   ├── app.controller      # Main controller
│   ├── app.module.ts       # Main module
│   ├── grpc-client.option  # GRPC config
│   └── main                # Main entrace
├── .env.example            # Example environment variables
├── package.json            # Root dependencies
└── yarn.lock               # Dependency lock file
```

## Installation

Make sure you have Node.js and Yarn installed.

```bash
# Install dependencies
yarn install
```

## Development

```bash
cd backend
cp .env.example .env
yarn start:dev
```

The backend will be available at `http://localhost:3000` (default port).

## API

### `POST /upload-and-extract`

Uploads an image and extracts text content using the OCR service.

#### Request

- **Headers**: `Content-Type: multipart/form-data`
- **Body**: Form-data with an `file` field containing the file to upload.

#### Response

```json
{
  "fileName": "Example File Name",
  "lines": [
    {
      "text": "Example Text",
      "mintTop": 111,
      "minHeight": 222,
      "words": [
        {
          "text": "Example Word Text",
          "top": 333,
          "left": 444,
          "width": 12,
          "height": 8
        }
      ]
    }
  ],
  "isError": false,
  "errorMsg": ""
}
```

### Static File Service

Uploaded files are stored in the `uploads/` directory and served statically by the main service. Files can be accessed via `http://localhost:3000/static/<filename>`.

## Environment Variables

```
# Upload Dir
UPLOAD_DIR=uploads

# OCR API URL
OCR_API_URL=https://api.ocr.space/parse/image

# OCR API KEY
OCR_API_KEY=
```

## Build

```bash
yarn build
```
