import React, { useState } from "react";
import CarsPanel from "./components/CarsPanel";
import Login from "./components/Login";
import Admin from "./components/Admin";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const handleLogin = (loggedUser, users) => {
    setUser(loggedUser);
    setAllUsers(users);
  };

  const handleLogout = () => {
    setUser(null);
    setAllUsers([]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === "USER") {
    return (
      <div className="app-container">
        <div className="flex justify-between items-center mb-4">
          <button className="button-logout" onClick={handleLogout} >
            Logout
          </button>
        </div>
        <CarsPanel user={user} />
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="app-container">
        <div className="flex justify-between items-center mb-4">
          <button className="button-logout" onClick={handleLogout} >
            Logout
          </button>
        </div>
        <Admin user={user} allUsers={allUsers} setAllUsers={setAllUsers} />
      </div>
    );
  }
}

export default App;
