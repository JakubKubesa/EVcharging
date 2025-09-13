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
      console.error("Delete user error:", err);
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
      alert("charging station added successfully");
      setStationName("");
      setStationPower("");
    } catch (err) {
      console.error("error when adding charging station:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin panel – {user.username}</h1>

      <h2 className="mt-6 text-xl font-semibold">All users:</h2>
      <ul className="mt-2 list-disc list-inside">
        {allUsers.map((u) => (
          <li key={u.id}>
            {u.username} ({u.email}) – {u.role}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleDeleteUser(u.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* add charging station */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Add parking spot (charging station):</h2>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Charging station name"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Power (kW)"
            value={stationPower}
            onChange={(e) => setStationPower(e.target.value)}
            className="border p-2 rounded w-32"
          />
          <button
            onClick={handleAddStation}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
