# Frontend

## Overview

This is the frontend of the project, built with **React**, **TypeScript**, **Vite.js**, and **TailwindCSS**. It supports functionalities for uploading images and selecting content within uploaded images.

## Features

- **Image Upload**: Easily upload images for processing.
- **Content Selection**: Select specific content areas within uploaded images for further actions.
- **Fast Development Setup**: Built with modern tools for rapid development and performance.

## Project Structure

```
frontend/
├── src/              # Source code
├── public/           # Static assets
├── .env.example      # Example environment variables
├── package.json      # Project dependencies
└── vite.config.ts    # Vite configuration
```

## Installation

Make sure you have Node.js and Yarn installed.

```bash
# Install dependencies
yarn install
```

## Development

```bash
cd frontend
cp .env.example .env
yarn dev
```

The frontend will be available at `http://localhost:5173` (default port).

## Environment Variables

Ensure the following environment variables are defined in the `.env` file:

```
# API URL
X_API_URL=http://localhost:3000

# Static resource access path
X_STATIC=http://localhost:3000/static
```

## Build

```bash
# Build the production bundle
yarn build
```

The built files will be available in the `dist` directory.
