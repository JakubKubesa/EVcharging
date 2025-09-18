import React, { useEffect, useState } from "react";

export default function StationList({ refreshTrigger }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchStations();
  }, [refreshTrigger]);

  const fetchStations = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/stations");
      if (!res.ok) throw new Error("Chyba při načítání stanic");
      const data = await res.json();
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this station including its reservations?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/stations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Chyba při mazání stanice");
      setStations((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Charging station list</h2>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Power (kW)</th>
            <th>State</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.powerKw}</td>
              <td>{s.active ? "Ano" : "Ne"}</td>
              <td>
                <button className="button-delete" onClick={() => handleDelete(s.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
