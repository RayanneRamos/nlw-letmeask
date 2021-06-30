import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './services/firebase';
import './styles/global.scss';
import { AuthContextProvider } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';

ReactDOM.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

