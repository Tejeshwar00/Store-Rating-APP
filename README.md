# Store-Rating-APP
Store Rating App 🏬⭐ – A full-stack web application where users can discover stores, view details, and share reviews with ratings. Includes authentication, review management, and store owner controls.


## Features

- 🏪 Browse and search local stores
- ⭐ Rate and review stores
- 📊 View detailed store information and ratings
- 👥 User authentication and profiles
- 📱 Responsive design for all devices
- 🔍 Filter stores by category and rating

## Tech Stack

### Frontend
- React - UI framework
- React Router - Client-side routing
- CSS3 - Styling
- Axios - HTTP client

### Backend
- Node.js + Express - Server framework
- MySQL - Database
- JWT-based authentication - User authentication

## Project Structure

```
store-rating-app/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── data/            # Mock data and constants
│   │   └── App.js           # Main app component
│   └── package.json
├── backend/                  # Backend API
│   ├── [your backend files]
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/store-rating-app.git
   cd store-rating-app
   ```

2. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install backend dependencies
   ```bash
   npm install
   # or if using Python: pip install -r requirements.txt
   ```

3. Start the backend server
   ```bash
   npm start
   # or: node server.js
   # or if using Python: python app.py
   ```
   Backend will run on `http://localhost:5000` (or your configured port)

## API Endpoints

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create new store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Reviews
- `GET /api/stores/:id/reviews` - Get store reviews
- `POST /api/stores/:id/reviews` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users (if implemented)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Usage

1. **Browse Stores**: View all available stores on the homepage
2. **Search & Filter**: Use search and category filters to find specific stores
3. **View Details**: Click on any store to see detailed information
4. **Rate & Review**: Leave ratings and reviews for stores you've visited
5. **User Account**: Register/login to save favorites and manage reviews

## Screenshots

![Homepage](screenshots/homepage.png)
![Store Details](screenshots/store-details.png)
![Add Review](screenshots/add-review.png)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Store owner dashboard
- [ ] Advanced search with location-based filtering
- [ ] Photo uploads for reviews
- [ ] Social media integration
- [ ] Mobile app version
- [ ] Email notifications


## Contact

Your Name - tejeshwarrao9179@gmail.com

Project Link: [https://github.com/Tejeshwar00/store-rating-app](https://github.com/Tejeshwar00/store-rating-app)

## Acknowledgments

- Thanks to all contributors
- Inspired by popular review platforms
- Built as a learning project
