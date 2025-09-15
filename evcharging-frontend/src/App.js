import React, { useState } from "react";
import CarsPanel from "./components/CarsPanel";
import Login from "./components/Login";
import Admin from "./components/Admin";

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
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Welcome, {user.username}</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <CarsPanel user={user} />
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin panel</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <Admin user={user} allUsers={allUsers} setAllUsers={setAllUsers} />
      </div>
    );
  }
}

export default App;
