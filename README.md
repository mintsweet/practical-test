# Practical Test

This project implements an OCR-based microservices architecture designed to upload and process images of documents using a third-party OCR API. The system is composed of two backend services (`main-service` and `ocr-service`) and a frontend (`frontend`) built using Yarn Workspaces for efficient dependency management and modular development.

## Project Structure

```
root/
├── frontend/         # Frontend code
├── backend/          # Backend code
│   ├── app/          # Main service
│   ├── ocr/          # OCR microservice
├── .yarn/            # Yarn 2 dependencies
├── package.json      # Project dependencies
└── yarn.lock         # Dependency lock file
```

## Installation

```bash
yarn install
```

## Development

### Start the Frontend

```
cd frontend
cp .env.example .env
yarn dev
```

The frontend will be available at `http://localhost:5173` (default port).

### Start the Backend

```
cd backend
cp .env.exmaple .env
yarn start:dev
```

The backend services will run on `http://localhost:3000` (default port for the main service).
