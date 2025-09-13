import React, { useEffect, useState } from "react";
import Reservation from "./Reservation";

function CarsPanel({ user }) {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [newCarSpz, setNewCarSpz] = useState("");
  const [newCarBattery, setNewCarBattery] = useState("");
  const [newCarModel, setNewCarModel] = useState(""); 

  // load car for user
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/cars/user/${user.id}`)
        .then(res => res.json())
        .then(data => setCars(data))
        .catch(err => console.error("Loading car error:", err));
    }
  }, [user]);

  // add car
  const handleAddCar = () => {
    if (!newCarSpz || !newCarBattery || !newCarModel) return;

    fetch(`http://localhost:8080/api/cars/add/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spz: newCarSpz,
        batteryCapacityKwh: parseInt(newCarBattery),
        model: newCarModel
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Adding car error");
        return res.json();
      })
      .then(car => {
        setCars([...cars, car]);
        setNewCarSpz("");
        setNewCarBattery("");
        setNewCarModel("");
      })
      .catch(err => console.error(err));
  };

  // delete car
  const handleDeleteCar = (carId) => {
    fetch(`http://localhost:8080/api/cars/${carId}`, {
      method: "DELETE"
    })
      .then(() => setCars(cars.filter(car => car.id !== carId)))
      .catch(err => console.error("Delete car error:", err));
  };

  return (
    <div>
      <h2>My cars</h2>

      {/* Choose car */}
      <div>
        <h4>Choose car</h4>
        {cars.length === 0 && <p>You don't have a car yet.</p>}
        {cars.map(car => (
          <div key={car.id} style={{ marginBottom: "8px" }}>
            <input
              type="radio"
              name="selectedCar"
              checked={selectedCarId === car.id}
              onChange={() => setSelectedCarId(car.id)}
            />
            <span style={{ marginLeft: "8px" }}>
              {car.spz} ({car.model}) — {car.batteryCapacityKwh} kWh
            </span>
            <button
              style={{ marginLeft: "12px" }}
              onClick={() => handleDeleteCar(car.id)}
            >
              Delete
            </button>
          </div>
        ))}

        {selectedCarId && <Reservation selectedCarId={selectedCarId} user={user} />}
      </div>


      {/* Add car*/}
      <div style={{ marginTop: "20px" }}>
        <h4>Add new car</h4>
        <input
          type="text"
          placeholder="Licence plate number"
          value={newCarSpz}
          onChange={e => setNewCarSpz(e.target.value)}
        />
        <input
          type="text"
          placeholder="Car model"
          value={newCarModel}
          onChange={e => setNewCarModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Battery capacity (kWh)"
          value={newCarBattery}
          onChange={e => setNewCarBattery(e.target.value)}
        />
        <button onClick={handleAddCar}>Add</button>
      </div>

      {selectedCarId && (
        <div style={{ marginTop: "20px" }}>
          <strong>You choose car with ID: {selectedCarId}</strong>
        </div>
      )}
    </div>
  );
}

export default CarsPanel;
