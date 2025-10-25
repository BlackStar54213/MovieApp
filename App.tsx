import React from 'react';
import { MovieProvider } from './src/context/MovieContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <MovieProvider>
      <AppNavigator />
    </MovieProvider>
  );
}