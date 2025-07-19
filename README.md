# Cargo Shipment Tracker - Web Application

A modern React-based web application for tracking cargo shipments with interactive maps, real-time updates, and comprehensive shipment management.

## 🚀 Features

- **Interactive Dashboard** - View shipments in table or map mode
- **Real-time Tracking** - Live location updates with interactive maps
- **Dark Mode** - Fully implemented dark theme
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Search & Filter** - Advanced filtering by status, shipment ID, container ID
- **CRUD Operations** - Create, edit, and manage shipments
- **Map Integration** - Leaflet maps with route visualization

## 🛠️ Technology Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Leaflet** - Interactive maps
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and dev server
- **React Hook Form** - Form handling
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API server running (see backend repository)

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Optional: Development settings
VITE_NODE_ENV=development
```

### Environment Variables Description

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` | No |
| `VITE_NODE_ENV` | Environment mode | `development` | No |

## 🚀 Installation & Setup

### Method 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <webapp-repository-url>
   cd cargo-shipment-tracker-webapp
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Create environment file**
   ```bash
   # Copy the example file and edit with your values
   copy .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

### Method 2: Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

## 🐳 Docker Setup

### Development with Docker

1. **Build Docker image**
   ```bash
   docker build -t cargo-tracker-webapp .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:80 -e VITE_API_BASE_URL=http://localhost:5000/api cargo-tracker-webapp
   ```

### Docker Compose (Full Stack)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  webapp:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    image: cargo-tracker-backend:latest
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/cargo_tracker
      - PORT=5000
      - NODE_ENV=production
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## 📁 Project Structure

```
cargo-shipment-tracker-webapp/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── CreateShipmentForm.tsx
│   │   ├── EditShipmentForm.tsx
│   │   ├── SimpleDashboard.tsx
│   │   └── ShipmentMap.tsx
│   ├── store/            # Redux store
│   ├── lib/              # Utility functions
│   ├── assets/           # Images, icons
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── Dockerfile            # Docker configuration
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```

## 🔗 API Integration

The webapp communicates with the backend API:

- `GET /api/shipments` - Fetch all shipments
- `GET /api/shipment/:id` - Fetch single shipment
- `POST /api/shipment` - Create new shipment
- `PUT /api/shipment/:id` - Update shipment
- `POST /api/shipment/:id/update-location` - Update location

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running on correct port
   - Check `VITE_API_BASE_URL` environment variable
   - Ensure CORS is properly configured in backend

2. **Map Not Loading**
   - Check internet connection for map tiles
   - Verify Leaflet CSS is properly imported

3. **Build Failures**
   - Clear node_modules: `rm -rf node_modules package-lock.json`
   - Reinstall dependencies: `npm install`

---

**Note**: Make sure the backend API is running before starting the webapp.
