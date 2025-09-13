import React, { useState } from "react";
import { deleteUser, addChargingStation } from "../services/api";

function Admin({ user, allUsers, setAllUsers }) {
  const [stationName, setStationName] = useState("");
  const [stationPower, setStationPower] = useState("");

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setAllUsers(allUsers.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Chyba při mazání uživatele:", err);
    }
  };

  const handleAddStation = async () => {
    try {
      const newStation = {
        name: stationName,
        powerKw: parseInt(stationPower),
        active: true
      };
      await addChargingStation(newStation);
      alert("Nabíjecí stanice byla úspěšně přidána.");
      setStationName("");
      setStationPower("");
    } catch (err) {
      console.error("Chyba při přidávání stanice:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin panel – {user.username}</h1>

      <h2 className="mt-6 text-xl font-semibold">Všichni uživatelé:</h2>
      <ul className="mt-2 list-disc list-inside">
        {allUsers.map((u) => (
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

      {/* add charging station */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Přidat parkovací místo (stanici):</h2>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Název stanice"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Výkon (kW)"
            value={stationPower}
            onChange={(e) => setStationPower(e.target.value)}
            className="border p-2 rounded w-32"
          />
          <button
            onClick={handleAddStation}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Přidat
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
