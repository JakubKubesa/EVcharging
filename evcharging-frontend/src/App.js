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

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === "USER") {
    return (
      <div className="p-6">
        <CarsPanel user={user} />
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return <Admin user={user} allUsers={allUsers} setAllUsers={setAllUsers} />;
  }
}

export default App;
