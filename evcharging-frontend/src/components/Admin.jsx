import React, { useState } from "react";
import { deleteUser, addChargingStation } from "../services/api";
import StationList from "./StationList";

function Admin({ user, allUsers, setAllUsers }) {
  const [stationName, setStationName] = useState("");
  const [stationPower, setStationPower] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // delete user (for admin)
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id, user.id);
      setAllUsers(allUsers.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  // add park spot charging station
  const handleAddStation = async () => {
    if (!stationName || !stationPower) {
      alert("Please fill in all required fields");
      return;
    }

    const powerValue = Math.max(1, parseInt(stationPower));

    try {
      const newStation = {
        name: stationName,
        powerKw: powerValue,
        active: true
      };
      await addChargingStation(newStation);
      alert("charging station added successfully");
      setStationName("");
      setStationPower("");

      setRefreshCounter(prev => prev + 1); 
    } catch (err) {
      console.error("error when adding charging station:", err);
    }
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin panel – {user.username}</h1>

      <h3 style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }} 
          className="mt-6 text-xl font-semibold">All users:</h3>
      <ul className="mt-2 list-disc list-inside">
        {allUsers.map((u) => (
          <li key={u.id}>
            {u.username} ({u.email}) – {u.role}
            <button
              className="button-delete"
              onClick={() => handleDeleteUser(u.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* add charging station */}
      <div className="mt-6" style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
        <h3 className="text-xl font-semibold">Add parking spot (charging station):</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Charging station name"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="border p-2 rounded"
          />
          <br></br>
          <input
            type="number"
            placeholder="Power (kW)"
            value={stationPower}
            onChange={(e) => setStationPower(e.target.value)}
            className="border p-2 rounded w-32"
            min={1}
          />
          <br></br>
          <button
            className="button button-add"
            onClick={handleAddStation}
          >
            Add
          </button>
        </div>
      </div>
      <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
        <StationList refreshTrigger={refreshCounter} />
      </div>    
    </div>
  );
}

export default Admin;
