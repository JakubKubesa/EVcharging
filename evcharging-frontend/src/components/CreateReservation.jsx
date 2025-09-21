import React, { useEffect, useState } from "react";
import { getAvailableStations, getCarById, createReservation } from "../services/api";


function Reservation({ selectedCarId, user, onCreated }) {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [car, setCar] = useState(null);
  const [station, setStation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Charging stations load
  useEffect(() => {
    if (!startTime) return;
    getAvailableStations(startTime)
      .then(setStations)
      .catch((err) => console.error("Loading available stations error:", err));
  }, [startTime]);

  // Cars load
  useEffect(() => {
    if (selectedCarId) {
      getCarById(selectedCarId)
        .then(setCar)
        .catch((err) => console.error("Loading car error:", err));
    } else {
      setCar(null);
    }
  }, [selectedCarId]);

  // choosed charging station settings
  useEffect(() => {
    if (selectedStationId) {
      const found = stations.find(s => s.id === selectedStationId);
      setStation(found || null);
    } else {
      setStation(null);
    }
  }, [selectedStationId, stations]);

  // Calculation of end time
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

  //Create reservation for user and car
  const handleCreateReservation = async () => {
    setErrorMessage(null);

    if (!user?.id || !car || !station || !startTime) {
      alert("Choose car, station and time");
      return;
    }

    const end = calcEndTime();
    if (!end) {
      alert("Cannot calculate end time");
      return;
    }

    const payload = {
      user: { id: user.id },
      station: { id: station.id },
      startTime: startTime,
      endTime: formatLocalDateTime(end),
      status: "PENDING",
    };

    try {
      const data = await createReservation(payload);
      alert("Reservation created successfully");
      console.log("Created reservation:", data);
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
      <h3>Reservation charging station for car with ID: {selectedCarId}</h3>

      {!car && <p>Loading info about car...</p>}

      {car && (
        <>
          <div style={{ marginTop: "10px" }}>
            <label>Charging start:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>

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

          <button className="button button-add" style={{ marginTop: "10px" }} onClick={handleCreateReservation}>
            Create reservation
          </button>

          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {errorMessage}
            </p>
          )}

          {station && startTime && (
            <p style={{ marginTop: "10px" }}>
              Estimated end including reserve time:{" "}
              {calcEndTime()?.toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Reservation;
