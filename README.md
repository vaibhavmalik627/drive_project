# File Upload Project

This is a Node.js web application that allows users to register, login, and upload files. Uploaded files are stored locally on the server, and metadata is saved in a MongoDB database. The project uses MongoDB Atlas for cloud database hosting.

## Technology Stack

- **Node.js**: JavaScript runtime environment for server-side development.
- **Express.js**: Web framework for building RESTful APIs and handling routing.
- **MongoDB Atlas**: Cloud-hosted NoSQL database for storing user and file metadata.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **EJS**: Embedded JavaScript templating engine for rendering dynamic HTML views.
- **bcrypt**: Library for hashing user passwords securely.
- **jsonwebtoken (JWT)**: For user authentication and authorization via tokens.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.
- **cookie-parser**: Middleware to parse cookies for authentication.
- **dotenv**: Loads environment variables from a .env file.

## Features

- User registration and login with JWT authentication
- File upload with metadata storage
- View and download uploaded files
- MongoDB Atlas integration for database
- EJS templating for views

## Setup

1. Clone the repository.

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory with the following variables:

```
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_atlas_connection_string
```

4. Start the server:

```bash
node app.js
```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Register a new user.
- Login with your credentials.
- Upload files on the home page.
- View and download your uploaded files.

## Notes

- Uploaded files are stored in the `uploads/` directory.
- MongoDB Atlas is used for storing user and file metadata.
- The `.gitignore` file excludes sensitive files and folders like `node_modules`, `.env`, and `uploads`.

## Future Improvements

- Integrate AWS S3 or other cloud storage for file uploads.
- Add password reset functionality.
- Improve UI/UX.

## License

This project is licensed under the MIT License.
