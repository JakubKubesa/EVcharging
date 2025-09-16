import React, { useEffect, useState } from "react";

export default function StationList() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchStations();
  }, []);

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
    if (!window.confirm("Opravdu chcete smazat tuto stanici včetně jejích rezervací?")) return;

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
      <h2>Seznam nabíjecích stanic</h2>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Název</th>
            <th>Výkon (kW)</th>
            <th>Aktivní</th>
            <th>Akce</th>
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
                  Smazat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
