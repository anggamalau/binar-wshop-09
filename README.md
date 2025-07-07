# TodoList Application

A modern, efficient TodoList application with user authentication and contemporary UI design. Built with Node.js, Express, SQLite, and Vanilla JavaScript with a custom bluish design system.

## Features

### Authentication
- **User Registration**: Create new user accounts with username and password
- **User Login**: Secure login with JWT token authentication
- **User Logout**: Safe token removal from storage
- **Password Security**: Bcrypt hashing for secure password storage
- **Token Management**: JWT tokens with 24-hour expiration
- **Token Storage**: Secure token storage in localStorage
- **Token Refresh**: Automatic token validation and refresh capability

### Task Management
- **Create Tasks**: Add new tasks with name, description, and deadline
- **View Tasks**: Display user-specific tasks sorted by deadline
- **Update Tasks**: Edit task details and mark as complete/incomplete
- **Delete Tasks**: Remove tasks with confirmation
- **User Privacy**: Tasks are isolated per user
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Indicators**: Shows overdue tasks and completion status
- **Modern Task Cards**: Enhanced UI with glass morphism effects
- **Interactive Elements**: Smooth animations and hover effects

### Modern UI Features
- **Contemporary Design**: Modern bluish color scheme with glass morphism
- **Enhanced Typography**: Inter font family for improved readability
- **Smooth Animations**: Fade-in effects and hover transitions
- **Gradient Elements**: Modern gradient buttons and backgrounds
- **Visual Feedback**: Enhanced focus states and interactive elements
- **Mobile Optimized**: Touch-friendly interface for mobile devices

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- CORS middleware
- Rate limiting
- dotenv (environment configuration)

### Frontend
- HTML5
- Tailwind CSS
- Custom Modern CSS (bluish theme)
- Vanilla JavaScript
- Font Awesome icons
- Google Fonts (Inter typography)
- Glass morphism effects
- CSS animations and transitions

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Environment Setup:
   - The `.env` file is already configured with development settings
   - For production, update the JWT_SECRET and other security settings
   - All environment variables are documented in the `.env` file

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   
   You should see output like:
   ```
   Looking for .env file at: /path/to/project/.env
   Environment variables loaded:
   - NODE_ENV: development
   - PORT: 3000
   - JWT_SECRET: ***loaded***
   Server is running on port 3000
   Environment: development
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. You'll see the modern TodoList interface with:
   - Sleek login/registration forms with glass morphism effects
   - Contemporary bluish color scheme
   - Smooth animations and transitions

## First Time Setup

1. When you first access the application, you'll see the login/registration page
2. Click "Don't have an account? Register here" to create a new account
3. Enter a username (minimum 3 characters) and password (minimum 6 characters)
4. After registration, you'll be automatically logged in and can start managing your tasks

## Development

To run in development mode with auto-reload:
```bash
cd backend
npm run dev
```

## API Endpoints

### Authentication (No auth required)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh JWT token

### Tasks (JWT Authentication required)
All task endpoints require `Authorization: Bearer <token>` header.

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Database Schema

The application uses SQLite with the following schema:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    task TEXT NOT NULL,
    description TEXT,
    deadline DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Project Structure

```
todolist-app/
├── .env                    # Environment configuration
├── .gitignore             # Git ignore rules
├── backend/
│   ├── server.js          # Main server with env config
│   ├── package.json       # Backend dependencies
│   ├── database/
│   │   ├── init.js        # Database initialization
│   │   └── tasks.db       # SQLite database
│   ├── routes/
│   │   ├── auth.js        # Authentication endpoints
│   │   └── tasks.js       # Task management endpoints
│   └── middleware/
│       ├── auth.js        # JWT authentication middleware
│       └── validation.js  # Input validation middleware
├── frontend/
│   ├── index.html         # Main HTML with modern design
│   ├── styles/
│   │   └── modern.css     # Modern bluish theme CSS
│   └── scripts/
│       └── app.js         # Frontend application logic
├── docs/
│   └── prd.md            # Product requirements document
└── README.md             # Project documentation
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Token Validation**: All protected endpoints validate JWT tokens
- **Secure Token Storage**: JWT tokens stored securely in localStorage
- **Input Validation**: All user inputs are validated and sanitized
- **CORS Protection**: Cross-origin requests are properly configured
- **Rate Limiting**: API endpoints are protected against abuse with configurable limits
- **User Data Isolation**: Tasks are strictly isolated per user account
- **Environment Security**: Sensitive configuration moved to environment variables
- **Production Ready**: Configurable security settings for different environments

## Environment Configuration

The application uses environment variables for configuration:

```bash
# Server settings
PORT=3000
NODE_ENV=development

# Database
DB_PATH=./backend/database/tasks.db

# Security
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# CORS and Rate Limiting
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

## Recent Updates

### v2.0 - Modern UI Redesign
- Completely redesigned user interface with modern bluish theme
- Added glass morphism effects and backdrop blur
- Enhanced typography with Inter font family
- Smooth animations and transitions throughout the app
- Improved task cards with visual state indicators
- Mobile-optimized touch interactions

### v1.5 - Infrastructure Improvements
- Added comprehensive environment variable support
- Improved security configuration
- Enhanced deployment readiness
- Better development workflow with debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.