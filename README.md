# Practical Test

This project implements an OCR-based microservices architecture designed to upload and process images of documents using a third-party OCR API. The system is composed of two backend services (`upload-service` and `ocr-service`) and a frontend (`website`) built using Yarn Workspaces for efficient dependency management and modular development.

## Project Structure

```
root/
├── apps/
│   ├── website/           # Frontend
│   ├── upload-service/    # Backend: Handles file uploads and interacts with the OCR service
│   └── ocr-service/       # Backend: Processes OCR requests using third-party APIs
└── README.md              # Project documentation
```
