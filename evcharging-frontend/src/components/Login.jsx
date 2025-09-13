import React, { useState } from "react";
import { registerUser, loginUser, getUsers } from "../services/api";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let loggedOrNewUser;
    if (isLogin) {
      loggedOrNewUser = await loginUser({ email: form.email, password: form.password });
    } else {
      loggedOrNewUser = await registerUser(form);
    }

    // for admin
    if (loggedOrNewUser.role === "ADMIN") {
      const usersFromDb = await getUsers();
      onLogin(loggedOrNewUser, usersFromDb);
    } else {
      onLogin(loggedOrNewUser, []);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isLogin ? "login" : "Sign up"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="User name"
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
            placeholder="Password"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            {isLogin ? "login" : "Sign up"}
          </button>
        </form>
        <p
          className="mt-4 text-sm text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up" : "Do you have an account? Login in"}
        </p>
      </div>
    </div>
  );
}

export default Login;
