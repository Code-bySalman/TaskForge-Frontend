# TaskForge Frontend

React + Vite frontend for TaskForge project management application.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

Output folder: `dist/`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation
│   │   ├── Sidebar.jsx          # Left sidebar menu
│   │   ├── Loading.jsx          # Loading spinner
│   │   ├── TaskCard.jsx         # Task display component
│   │   ├── StatCard.jsx         # Statistics card
│   │   ├── ProtectedRoute.jsx   # Auth protection
│   │   └── AdminRoute.jsx       # Admin role protection
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state
│   ├── hooks/
│   │   └── useAuth.js           # useAuth hook
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ProjectDetailPage.jsx
│   │   └── CreateProjectPage.jsx
│   ├── services/
│   │   └── api.js               # Axios API client
│   ├── styles/
│   │   └── globals.css          # Global styles
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Start development server (alternative)
npm start
```

## Features

### Pages

#### Login Page
- Email and password input
- Form validation
- Error messages
- Admin-created account messaging
- Demo credentials display

#### Admin Setup Page
- Route: `/setup-admin`
- Creates the first admin account only
- Prevents member self-registration
- Links back to login

#### Dashboard Page
- Overall statistics (total, completed, pending, overdue tasks)
- Task breakdown by status
- List of overdue tasks
- Real-time data updates

#### Projects Page
- List all user's projects
- Create project button (admin only)
- Delete project option (admin only)
- View project details link

#### Project Detail Page
- Project information
- Create tasks (admin only)
- List all project tasks
- Update task status
- Delete tasks (admin only)
- Team members section
- Add/remove members (admin only)

#### Create Project Page
- Project name and description
- Add multiple team members
- Form validation
- Cancel/Submit buttons

#### Manage Users Page
- Admin-only page for creating member accounts
- Lists existing users
- Prompts admin to share credentials manually

### Components

#### Navbar
- Logo/branding
- User info display
- Logout button
- Login link fallback (when used outside authenticated layout)

#### Sidebar
- Navigation menu
- Home, Projects, Create Project links
- Responsive design

#### TaskCard
- Task title and description
- Status badge
- Assigned user
- Due date (with overdue indicator)
- Status update button

#### StatCard
- Statistic display
- Optional highlight style
- Subtitle support

#### Loading
- Animated spinner
- Loading text

#### ProtectedRoute
- User authentication check
- Redirects to login if not authenticated

#### AdminRoute
- Admin role check
- Redirects if user not admin

## API Integration

### API Service (`src/services/api.js`)

All API calls go through axios instance with automatic token attachment:

```javascript
import { authAPI, projectAPI, taskAPI, userAPI } from './services/api';

// Auth
authAPI.login(credentials)
authAPI.signup(userData)
authAPI.getProfile()

// Projects
projectAPI.createProject(data)
projectAPI.getProjects()
projectAPI.getProjectById(id)
projectAPI.updateProject(id, data)
projectAPI.deleteProject(id)
projectAPI.addMember(projectId, memberId)
projectAPI.removeMember(projectId, memberId)

// Tasks
taskAPI.createTask(projectId, data)
taskAPI.getProjectTasks(projectId)
taskAPI.updateTask(taskId, data)
taskAPI.deleteTask(taskId)
taskAPI.getDashboardStats()

// Users
userAPI.createUser(data)
userAPI.getAllUsers()
userAPI.getUserById(id)
```

## Authentication Flow

1. First admin can complete setup at `/setup-admin` if no admin exists yet
2. Admin creates member accounts from the Manage Users page
3. Users log in with the credentials given to them by an admin
4. Backend returns JWT token
5. Token stored in localStorage
6. Token added to all API requests via axios interceptor
7. Token persists across page refreshes
8. User authenticated until token expires (7 days)

## Styling

### Tailwind CSS

All styles use Tailwind utility classes. Custom configuration in `tailwind.config.js`:

```javascript
colors: {
  primary: '#1a1a1a',      // Black
  secondary: '#6b7280',    // Gray
  accent: '#8b7355',       // Earthy/Brown
  light: '#f3f4f6',        // Light gray
  border: '#e5e7eb'        // Border gray
}
```

### Global Styles (`src/styles/globals.css`)

Pre-defined utility classes:
- `.btn` - Button base style
- `.btn-primary`, `.btn-secondary`, `.btn-outline` - Button variants
- `.input` - Input field style
- `.card` - Card container
- `.badge` - Badge/tag style with color variants
- `.container` - Max-width container

## Helper Functions (`src/utils/helpers.js`)

```javascript
formatDate(date)              // Format date to readable string
getStatusColor(status)        // Get badge color for status
getStatusLabel(status)        // Get readable status label
isOverdue(dueDate, status)   // Check if task is overdue
```

## Context API

### AuthContext

Manages authentication state globally:

```javascript
const { user, token, loading, login, signup, logout } = useAuth();

// user: { id, name, email, role }
// token: JWT token string
// loading: boolean
// login(email, password): Promise
// signup(name, email, password): Promise // first-admin setup only
// logout(): void
```

## UI/UX Features

### Design
- **Color Palette**: Neutral (black, white, gray, earthy tones)
- **Layout**: Sidebar + main content
- **Typography**: Clean, readable fonts
- **Icons**: Status badges instead of complex icons

### Interactions
- **Smooth Transitions**: CSS transitions for hover states
- **Loading States**: Spinner during async operations
- **Error Messages**: Clear, user-friendly error alerts
- **Confirmation Dialogs**: Confirm destructive actions

### Responsiveness
- Sidebar hides on mobile (can be improved)
- Cards stack vertically on smaller screens
- Input fields full-width on mobile

## Development Workflow

### Adding a New Page

1. Create file in `src/pages/`
2. Build the component with hooks/services
3. Add route in `App.jsx`
4. Create navigation link in Sidebar/Navbar

Example:
```javascript
import React, { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';

export default function NewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await projectAPI.getProjects();
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### Adding a New Component

1. Create file in `src/components/`
2. Build component with props
3. Import and use in pages

Example:
```javascript
export default function MyComponent({ title, data, onAction }) {
  return (
    <div className="card p-4">
      <h2 className="font-bold text-primary">{title}</h2>
      {/* JSX here */}
    </div>
  );
}
```

## Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy

### Deploy to Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Configure build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

### Update API URL for Production

Edit `src/services/api.js`:
```javascript
const API_URL = 'https://your-production-backend.com/api';
```

## Environment Variables

Create `.env` in frontend root (optional):
```
VITE_API_URL=http://localhost:5000/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Optimization

### Current
- Code splitting with React Router
- Lazy loading pages

### Future Improvements
- Image optimization
- Component memorization (React.memo)
- Virtual lists for large task lists
- Service Worker for offline support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Not Responding
- Ensure backend is running on port 5000
- Check network tab in browser DevTools
- Verify CORS configuration

### Login Not Working
- Check backend is running
- Verify credentials are correct
- Check token in localStorage (DevTools → Application)

### Styling Not Applied
- Clear browser cache
- Restart dev server
- Check Tailwind configuration

### Build Fails
- Delete `node_modules` and `dist`
- Run `npm install && npm run build`
- Check for syntax errors

## Dependencies

### Production
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client

### Dev
- **@vitejs/plugin-react**: Vite React plugin
- **vite**: Build tool
- **tailwindcss**: Utility-first CSS
- **postcss**: CSS processing
- **autoprefixer**: CSS vendor prefixes

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.

---

Built with React + Vite + Tailwind CSS
