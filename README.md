# ShadiSync

ShadiSync is an all-in-one event management system that streamlines the process of planning and organizing events. It provides features for event scheduling, invitation handling, expense tracking, and gift management, ensuring a smooth and hassle-free experience.

Live Demo: [www.shadisync.amitdhangar.in](https://shadisync.amitdhangar.in)

---

## Features

- Event scheduling and management
- Invitation handling
- Expense tracking
- Gift management
- Secure authentication with password hashing
- File uploads to AWS S3
- Schema-level request validation

## Tech Stack

- Runtime: Node.js
- Framework: Express 5
- Database: MongoDB with Mongoose
- Auth: JSON Web Tokens (JWT) with bcrypt for password hashing
- File Storage: AWS S3 (uploads handled via Multer)
- Validation: validator.js plus custom schema validators
- Utilities: nanoid, cookie-parser, body-parser, dotenv
- Dev Tooling: Nodemon

## Project Structure

```
ShadiSync/
├── Schemavalidator/    # Schema-level validation logic
├── controllers/        # Route handler / business logic
├── database/           # Database connection setup
├── middlewares/        # Express middlewares (auth, error handling, etc.)
├── models/             # Mongoose schemas/models
├── routes/             # API route definitions
├── service/             # Service layer / helper logic
├── validator/           # Input validators
├── .env.local           # Environment variables (fill in with your own values)
├── package.json
└── server.js             # Application entry point
```

---

## Getting Started (Local Setup)

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher recommended)
- MongoDB (a local instance, or a MongoDB Atlas cluster)
- An AWS account with an S3 bucket (for file uploads)
- npm (comes bundled with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/AmitDhangarr/ShadiSync.git
cd ShadiSync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

The repository includes a `.env.local` file with the variables the app expects. Fill it in with your own values:

```env
PORT=8000
MONGODBURL=mongodb://127.0.0.1:27017/your_db_name?directConnection=true&serverSelectionTimeoutMS=2000
SECRET=your_jwt_or_session_secret_here
AWS_AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME=your-s3-bucket-name
```

Variable reference:

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGODBURL` | MongoDB connection string |
| `SECRET` | Secret used to sign JWTs / sessions |
| `AWS_AWS_REGION` | AWS region for your S3 bucket |
| `AWS_ACCESS_KEY_ID` | AWS access key with S3 permissions |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key |
| `AWS_BUCKET_NAME` | Name of the S3 bucket used for file uploads |

Never commit real credentials to version control. Keep `.env.local` out of git (or rotate any keys that were previously exposed if this file was ever committed with real values).

### 4. Run the app

For development, with auto-restart via Nodemon:

```bash
npm start
```

The server will run at `http://localhost:8000` (or whichever `PORT` you configured).

---

## API Overview

ShadiSync exposes a REST API for managing events, invitations, expenses, and gifts. Routes are organized under the `routes/` directory and mapped to their respective `controllers/`. Explore the `routes/` folder for the full list of available endpoints.

---

## Deployment

The live version of this project is hosted at:

[www.shadisync.amitdhangar.in](https://shadisync.amitdhangar.in)

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Amit Dhangar
