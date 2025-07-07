
## 1. Project Overview

# TodoList Application - Product Requirements Document
### 1.1 Product Vision
A simple, efficient TodoList application that allows users to manage their tasks with basic CRUD operations. The MVP focuses on core functionality with a clean, responsive interface.

### 1.2 Target Users
- Individuals seeking a straightforward task management solution
- Users who prefer web-based applications over mobile apps
- People who need basic task organization with deadlines

### 1.3 Success Criteria
- Users can register and login securely
- Users can create, read, update, and delete tasks
- Tasks are isolated per user (privacy)
- Application loads quickly and responds smoothly
- Data persists between sessions
- Interface is intuitive and requires no learning curve

## 2. Technical Stack

### 2.1 Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: SQLite
- **API**: RESTful endpoints
- **Authentication**: JWT (JSON Web Token) based auth with bcrypt
- **Security**: CORS, rate limiting, input validation
- **Configuration**: Environment variable management with dotenv
- **Deployment**: Environment-specific configuration support

### 2.2 Frontend
- **Markup**: HTML5
- **Styling**: Tailwind CSS + Custom Modern CSS
- **JavaScript**: Vanilla JS (no frameworks)
- **Architecture**: Single Page Application (SPA)
- **Design**: Modern bluish theme with glass morphism effects
- **Typography**: Inter font family for enhanced readability
- **Animations**: Smooth transitions and hover effects

### 2.3 Database Schema
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

## 3. Core Features (MVP)

### 3.1 User Authentication
**User Registration**
- Username and password registration
- Username uniqueness validation
- Password strength requirements (minimum 6 characters)
- Username length requirements (minimum 3 characters)
- Secure password hashing with bcrypt

**User Login**
- Username/password authentication
- JWT token-based authentication
- Secure token storage in localStorage
- Token expiration handling (24 hours)
- Automatic token validation

**User Logout**
- Clear JWT token from storage
- Redirect to login page
- Secure token invalidation

### 3.2 Task Management
**Create Task**
- Input fields: Task name (required), Description (optional), Deadline (optional)
- Form validation for required fields
- Auto-save on form submission

**View Tasks**
- Display all tasks in a list format
- Show task name, description, deadline, and completion status
- Visual indicators for overdue tasks
- Sort tasks by deadline (ascending)

**Update Task**
- Edit task details inline or via modal
- Mark tasks as complete/incomplete
- Update any field (task, description, deadline)

**Delete Task**
- Remove tasks with confirmation prompt
- Soft delete option for data recovery

### 3.2 User Interface Requirements
**Modern Design System**
- Clean, minimalist design with modern bluish color scheme
- Glass morphism effects with backdrop blur
- Contemporary typography using Inter font family
- Gradient buttons with smooth animations
- Modern input styling with enhanced focus states

**Visual Enhancements**
- Responsive layout (desktop and mobile)
- Clear visual hierarchy with modern spacing
- Smooth animations and transitions
- Enhanced task cards with priority indicators
- Contemporary color palette (blues, cyans, slates)

**User Experience**
- Intuitive navigation and controls
- Loading states for async operations
- Hover effects and interactive feedback
- Mobile-optimized touch interactions

### 3.3 Data Persistence
- All task data stored in SQLite database
- Automatic data synchronization
- Data integrity and validation

## 4. API Endpoints

### 4.1 Authentication API
```
POST   /api/auth/register   - Register new user
POST   /api/auth/login      - Login user
GET    /api/auth/me         - Get current user info
POST   /api/auth/refresh    - Refresh JWT token
```

### 4.2 Tasks API (Requires Authentication)
```
GET    /api/tasks           - Retrieve all user tasks
POST   /api/tasks           - Create new task
PUT    /api/tasks/:id       - Update specific task
DELETE /api/tasks/:id       - Delete specific task
GET    /api/tasks/:id       - Get specific task
```

### 4.3 Request/Response Format
**User Registration (POST /api/auth/register)**
```json
Request:
{
  "username": "john_doe",
  "password": "securepassword123"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**User Login (POST /api/auth/login)**
```json
Request:
{
  "username": "john_doe",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Authentication Header (Required for all Task API calls)**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Create Task (POST /api/tasks)**
```json
Request:
{
  "task": "Complete project proposal",
  "description": "Finalize the Q4 project proposal document",
  "deadline": "2025-07-15"
}

Response:
{
  "id": 1,
  "task": "Complete project proposal",
  "description": "Finalize the Q4 project proposal document",
  "deadline": "2025-07-15",
  "completed": false,
  "created_at": "2025-07-07T10:00:00Z",
  "updated_at": "2025-07-07T10:00:00Z"
}
```

**Get All Tasks (GET /api/tasks)**
```json
Response:
{
  "tasks": [
    {
      "id": 1,
      "task": "Complete project proposal",
      "description": "Finalize the Q4 project proposal document",
      "deadline": "2025-07-15",
      "completed": false,
      "created_at": "2025-07-07T10:00:00Z",
      "updated_at": "2025-07-07T10:00:00Z"
    }
  ]
}
```

## 5. User Experience Flow

### 5.1 Primary User Journey
1. User opens the application
2. Views existing tasks (if any)
3. Clicks "Add Task" button
4. Fills in task details (name, description, deadline)
5. Submits form
6. Task appears in the list
7. User can mark as complete or edit/delete as needed

### 5.2 Task States
- **Active**: Task is created and pending completion
- **Completed**: Task is marked as done
- **Overdue**: Task deadline has passed and task is not completed

## 6. Technical Requirements

### 6.1 Performance
- Page load time under 2 seconds
- API response time under 500ms
- Smooth UI interactions (no blocking operations)

### 6.2 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### 6.3 Data Validation
- Task name: Required, maximum 200 characters
- Description: Optional, maximum 500 characters
- Deadline: Optional, must be valid date format (YYYY-MM-DD)

## 7. File Structure

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
│   ├── scripts/
│   │   └── app.js         # Frontend application logic
│   └── assets/
├── docs/
│   └── prd.md            # Product requirements document
└── README.md             # Project documentation
```

## 8. Development Phases

### Phase 1: Backend Setup
- Initialize Express.js server
- Set up SQLite database
- Create REST API endpoints
- Implement data validation

### Phase 2: Frontend Development
- Create HTML structure
- Implement Tailwind CSS styling
- Add JavaScript functionality
- Connect to backend API

### Phase 3: Integration & Testing
- End-to-end testing
- UI/UX refinements
- Error handling
- Performance optimization

## 9. Error Handling

### 9.1 Backend Errors
- Database connection failures
- Invalid data format
- Missing required fields
- Resource not found (404)
- Authentication failures (401)
- Username already exists
- Invalid credentials

### 9.2 Frontend Errors
- Network connectivity issues
- API request failures
- Form validation errors
- Loading states management
- Authentication state management
- Token expiration handling

## 10. Security Considerations

### 10.1 Input Validation
- Sanitize all user inputs
- Prevent SQL injection
- Validate data types and lengths

### 10.2 Authentication Security
- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- Secure token signing with secret key
- Token expiration (24 hours)
- Token validation on every request

### 10.3 Basic Security
- CORS configuration
- Basic rate limiting
- Input sanitization

## 11. Recent Updates & Enhancements

### 11.1 UI/UX Modernization (Completed)
- **Modern Design System**: Implemented contemporary bluish color scheme
- **Glass Morphism**: Added backdrop blur effects and translucent cards
- **Enhanced Typography**: Integrated Inter font family for improved readability
- **Smooth Animations**: Added fade-in effects and hover transitions
- **Interactive Elements**: Enhanced buttons with gradient backgrounds and animations
- **Visual Indicators**: Color-coded task cards for completed and overdue states

### 11.2 Infrastructure Improvements (Completed)
- **Environment Configuration**: Added comprehensive .env file support
- **Deployment Ready**: Environment-specific configuration management
- **Security Enhancements**: Configurable JWT secrets and bcrypt rounds
- **Development Workflow**: Improved debugging and logging capabilities

### 11.3 Future Enhancements (Post-MVP)
- Task categories/tags
- Task priority levels
- Search and filter functionality
- Task sharing capabilities
- Due date notifications
- Data export functionality
- Real-time updates
- Offline functionality
- Advanced sorting options
- Bulk operations

## 12. Acceptance Criteria

### 12.1 MVP Completion Criteria
**Authentication Features**
- [x] Users can register with username and password
- [x] Users can login with valid credentials
- [x] Users can logout and clear JWT token
- [x] Registration validates username uniqueness
- [x] Password requirements are enforced
- [x] JWT tokens persist across browser sessions
- [x] Token expiration is properly handled

**Task Management Features**
- [x] Users can create tasks with name, description, and deadline
- [x] Users can view only their own tasks in a clean list format
- [x] Users can edit existing tasks
- [x] Users can mark tasks as complete/incomplete
- [x] Users can delete tasks
- [x] Tasks are isolated per user (privacy)

**Modern UI/UX Features (Completed)**
- [x] Modern bluish color scheme implementation
- [x] Glass morphism effects with backdrop blur
- [x] Smooth animations and transitions
- [x] Enhanced typography with Inter font
- [x] Gradient buttons and modern input styling
- [x] Responsive design for all devices
- [x] Visual task state indicators (completed, overdue)

**Infrastructure Features (Completed)**
- [x] Environment variable configuration
- [x] Deployment-ready setup
- [x] Enhanced security configuration
- [x] Improved development workflow

**General Requirements**
- [x] Application works on desktop and mobile browsers
- [x] Data persists between sessions
- [x] API endpoints return proper HTTP status codes
- [x] UI follows modern design principles
- [x] Authentication is required for all task operations

### 12.2 Quality Assurance
- [x] All API endpoints tested and working
- [x] Authentication endpoints handle edge cases
- [x] Frontend handles all error states gracefully
- [x] Database operations are reliable
- [x] User data isolation is enforced
- [x] Password security best practices followed
- [x] Application performance meets requirements
- [x] Code is clean and well-documented
- [x] Environment configuration properly implemented
- [x] Modern UI components function correctly
- [x] Responsive design verified across devices