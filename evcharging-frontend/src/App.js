import React, { useState, useEffect } from "react";
import { registerUser, loginUser, getUsers } from "./services/api";
import CarsPanel from "./components/CarsPanel";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let loggedOrNewUser;
    if (isLogin) {
      loggedOrNewUser = await loginUser({ email: form.email, password: form.password });
    } else {
      loggedOrNewUser = await registerUser(form);
    }
    setUser(loggedOrNewUser);

    // Pokud je uživatel ADMIN, načteme všechny uživatele
    if (loggedOrNewUser.role === "ADMIN") {
      const usersFromDb = await getUsers();
      setAllUsers(usersFromDb);
    }
  };

  // --- Po přihlášení ---
  if (user) {
    // USER vidí CarsPanel
    if (user.role === "USER") {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Vítej, {user.username} 👋</h1>
          <CarsPanel user={user} />
        </div>
      );
    }

    // ADMIN vidí seznam uživatelů
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

  // --- Přihlášení / Registrace ---
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isLogin ? "Přihlášení" : "Registrace"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Uživatelské jméno"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Heslo"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            {isLogin ? "Přihlásit se" : "Registrovat"}
          </button>
        </form>
        <p
          className="mt-4 text-sm text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Nemáš účet? Registruj se" : "Máš účet? Přihlas se"}
        </p>
      </div>
    </div>
  );
}

export default App;
