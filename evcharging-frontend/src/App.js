import React, { useState } from "react";
import CarsPanel from "./components/CarsPanel";
import Login from "./components/Login";

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
        <h1 className="text-2xl font-bold">Vítej, {user.username} 👋</h1>
        <CarsPanel user={user} />
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin panel – {user.username}</h1>
        <h2 className="mt-6 text-xl font-semibold">Všichni uživatelé:</h2>
        <ul className="mt-2 list-disc list-inside">
          {allUsers.map((u) => (
            <li key={u.id}>
              {u.username} ({u.email}) – {u.role}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
