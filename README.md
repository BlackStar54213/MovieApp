# 🎬 TMDB Movie App

A beautiful React Native movie browsing application built with Expo, TypeScript, and The Movie Database (TMDB) API. Browse popular movies, search by title, filter by genre, and save your favorites!



## ✨ Features

- 📱 **Browse Popular Movies** - Discover trending and popular movies
- 🔍 **Search Functionality** - Find movies by title
- 🎭 **Genre Filtering** - Filter movies by genre (Action, Comedy, Drama, etc.)
- ❤️ **Favorites** - Save your favorite movies for quick access
- 📄 **Detailed Movie Info** - View full details including:
  - Poster and backdrop images
  - Overview and plot
  - Release date and runtime
  - Ratings and genres
- 🎨 **Beautiful Dark Theme UI** - Netflix-inspired design
- 📲 **Bottom Tab Navigation** - Easy navigation between screens



## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Context API + useReducer** - State management
- **Axios** - HTTP client for API calls
- **TMDB API** - Movie database API
- **Jest** - Testing framework

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo Go app** on your phone:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **TMDB API Key** - [Get it here](https://www.themoviedb.org/settings/api)

## 🚀 Installation & Setup

### 1. Clone the Repository

### 2. Install Dependencies
npm install

### 3. Get Your TMDB API Key

### 4. Create Environment File

Create a `.env` file in the root directory of the project.

Add the following content to your `.env` file:

```env
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**Important:** Replace `your_api_key_here` with your actual TMDB API key!

### 5. Start the Development Server

```bash
npx expo start
```

Or with cache cleared (recommended for first run):

```bash
npx expo start -c
```

### 6. Run on Your Device

Once the development server starts, you'll see a QR code in your terminal.

**On Android:**
1. Open the **Expo Go** app
2. Tap **Scan QR Code**
3. Scan the QR code from your terminal

**On iOS:**
1. Open your **Camera** app
2. Point it at the QR code
3. Tap the notification to open in Expo Go

**Alternative Methods:**
- Press `a` - Open on Android emulator
- Press `i` - Open on iOS simulator (Mac only)
- Press `w` - Open in web browser

## 📁 Project Structure

```
tmdb-movie-app/
├── App.tsx                      # Main app entry point
├── babel.config.js              # Babel configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── .env                         # Environment variables (create this!)
├── .gitignore                   # Git ignore file
│
└── src/
    ├── components/              # Reusable components
    │   ├── MovieCard.tsx        # Movie card component
    │   └── SearchBar.tsx        # Search bar component
    │
    ├── context/                 # State management
    │   └── MovieContext.tsx     # Global movie state context
    │
    ├── navigation/              # Navigation setup
    │   └── AppNavigator.tsx     # Navigation configuration
    │
    ├── screens/                 # App screens
    │   ├── HomeScreen.tsx       # Home screen with movie list
    │   ├── SearchScreen.tsx     # Search screen
    │   ├── FavoritesScreen.tsx  # Favorites screen
    │   └── MovieDetailScreen.tsx # Movie details screen
    │
    ├── services/                # API services
    │   └── api.ts               # TMDB API integration
    │
    ├── types/                   # TypeScript type definitions
    │   ├── movie.types.ts       # Movie-related types
    │   └── env.d.ts             # Environment variable types
    │
    └── utils/                   # Utility functions
        └── movieReducer.test.ts # Jest tests
```

## 🧪 Running Tests

```bash
npm test
```

## 🌟 Features to Add (Future Enhancements)


- [ ] Movie trailers and videos
- [ ] User authentication
- [ ] Personalized recommendations
- [ ] Share movies with friends
- [ ] Dark/Light theme toggle
- [ ] Multiple language support

## 📚 API Documentation

This app uses the TMDB API. Key endpoints:

- `GET /movie/popular` - Get popular movies
- `GET /search/movie` - Search movies
- `GET /movie/{movie_id}` - Get movie details
- `GET /genre/movie/list` - Get movie genres

Full API documentation: https://developers.themoviedb.org/3

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)



---

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ using React Native & Expo
