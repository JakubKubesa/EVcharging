import React, { useEffect, useState } from "react";

function Reservation({ selectedCarId, user }) {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [car, setCar] = useState(null);
  const [station, setStation] = useState(null);

  // Load parking spot
  useEffect(() => {
    fetch("http://localhost:8080/api/stations")
      .then(res => res.json())
      .then(data => setStations(data))
      .catch(err => console.error("Loading station error:", err));
  }, []);

  // Load car details
  useEffect(() => {
    if (selectedCarId) {
      fetch(`http://localhost:8080/api/cars/${selectedCarId}`)
        .then(res => res.json())
        .then(data => setCar(data))
        .catch(err => console.error("Loading car error:", err));
    } else {
      setCar(null);
    }
  }, [selectedCarId]);

  // Load parking spot details
  useEffect(() => {
    if (selectedStationId) {
      const found = stations.find(s => s.id === selectedStationId);
      setStation(found || null);
    } else {
      setStation(null);
    }
  }, [selectedStationId, stations]);

  // calculation end charging time
  const calcEndTime = () => {
    if (!car || !station || !startTime) return null;
  
    const battery = car.batteryCapacityKwh;
    const power = station.powerKw || 1;
    const chargeTimeMinutes = Math.ceil((battery / power) * 60) + 5;
  
    const [datePart, timePart] = startTime.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
  
    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + chargeTimeMinutes * 60000);
  
    return end;
  };


  const formatLocalDateTime = (d) => {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };


  const handleCreateReservation = () => {
    if (!user?.id || !car || !station || !startTime) {
      alert("Choose car, station and time");
      return;
    }

    const end = calcEndTime();

    fetch("http://localhost:8080/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { id: user.id },
        station: { id: station.id },
        startTime: startTime,                
        endTime: formatLocalDateTime(end),
        status: "PENDING"
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error!");
        return res.json();
      })
      .then(data => {
        alert("Reservation created");
        console.log(data);
      })
      .catch(err => console.error(err));
  };


  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
      <h3>Reservation charging station for car with ID: {selectedCarId}</h3>

      {!car && <p>Loading info about car...</p>}

      {car && (
        <>
          <div>
            <label>Choose station:</label>
            <select
              value={selectedStationId || ""}
              onChange={e => setSelectedStationId(Number(e.target.value))}
            >
              <option value="" disabled>-- vyber stanici --</option>
              {stations.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.powerKw} kW)
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>Charging start:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>

          <button style={{ marginTop: "10px" }} onClick={handleCreateReservation}>
            Create reservation
          </button>

          {station && startTime && (
            <p style={{ marginTop: "10px" }}>
              Estemited end including reserve time :{" "}
              {calcEndTime()?.toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Reservation;
