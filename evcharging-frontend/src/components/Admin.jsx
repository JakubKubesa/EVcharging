import React from "react";
import { deleteUser } from "../services/api";

function Admin({ user, allUsers, setAllUsers }) {
  
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setAllUsers(allUsers.filter(u => u.id !== id));
    } catch (err) {
      console.error("Chyba při mazání uživatele:", err);
    }
  };

  const handleAddParkSpot = async (newSpot) => {
    // logic for adding parking spot
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin panel – {user.username}</h1>

      <h2 className="mt-6 text-xl font-semibold">Všichni uživatelé:</h2>
      <ul className="mt-2 list-disc list-inside">
        {allUsers.map(u => (
          <li key={u.id}>
            {u.username} ({u.email}) – {u.role}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleDeleteUser(u.id)}
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>

      {/* implementation (add parking spot) */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Přidat parkovací místo:</h2>
        {/* button add parking spot */}
      </div>
    </div>
  );
}

export default Admin;
