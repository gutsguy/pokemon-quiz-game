// Import necessary libraries


import React, { useState } from 'react';
import Login from './Login';
import QuizGame from './QuizGame';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userInfo) => {
    setUser(userInfo);
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      <header>
        <h1>Pokemon Quiz Game</h1>
      </header>

      <main>
        {isLoggedIn ? (
          <QuizGame user={user} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </main>

      <footer>
        <p>&copy; 2025 Pokemon Quiz Game. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;

/*
// Import necessary libraries
import React, { useState } from 'react';
import QuizGame from './QuizGame';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for direct access to QuizGame
  const [user, setUser] = useState({ name: 'Guest', email: 'guest@example.com' }); // Default guest user
  return (
    <div className="app">
      <header>
        <h1>Pokemon Quiz Game</h1>
      </header>

      <main>
        {isLoggedIn ? (
          <QuizGame user={user} /> // Directly show QuizGame
        ) : (
          <div className="login-placeholder">
            <p>Login functionality not implemented. Defaulting to QuizGame.</p>
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2025 Pokemon Quiz Game. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
*/