import React, { useEffect, useState } from "react";

function Reservation({ selectedCarId, user }) {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  // loading all stations
  useEffect(() => {
    fetch("http://localhost:8080/api/stations")
      .then(res => res.json())
      .then(data => setStations(data))
      .catch(err => console.error("Chyba při načítání stanic:", err));
  }, []);

  const handleCreateReservation = () => {
    if (!selectedStationId || !startTime || !endTime) {
      setMessage("Vyplň všechna pole!");
      return;
    }

    const payload = {
      user: { id: user.id },
      station: { id: selectedStationId },
      startTime,
      endTime,
      status: "PENDING"
    };

    fetch("http://localhost:8080/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Chyba při vytváření rezervace");
        return res.json();
      })
      .then(() => {
        setMessage("Rezervace byla úspěšně vytvořena!");
        setSelectedStationId(null);
        setStartTime("");
        setEndTime("");
      })
      .catch(err => {
        console.error(err);
        setMessage("Chyba při vytváření rezervace.");
      });
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "12px" }}>
      <h3>Rezervace pro vybrané auto ID: {selectedCarId}</h3>

      <div>
        <label>Vyber stanici:</label>
        <select
          value={selectedStationId || ""}
          onChange={e => setSelectedStationId(Number(e.target.value))}
        >
          <option value="">-- vyber --</option>
          {stations.map(st => (
            <option key={st.id} value={st.id}>
              {st.name} ({st.powerKw} kW)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Start:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
      </div>

      <div>
        <label>Konec:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
      </div>

      <button onClick={handleCreateReservation} style={{ marginTop: "10px" }}>
        Rezervovat
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Reservation;
