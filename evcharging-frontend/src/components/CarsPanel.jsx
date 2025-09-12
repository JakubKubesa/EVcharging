import React, { useEffect, useState } from "react";

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
        .catch(err => console.error("Chyba při načítání aut:", err));
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
        if (!res.ok) throw new Error("Chyba při přidávání auta");
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
      .catch(err => console.error("Chyba při mazání auta:", err));
  };

  return (
    <div>
      <h2>Moje auta</h2>

      {/* Choose car */}
      <div>
        <h4>Vyber auto</h4>
        {cars.length === 0 && <p>Nemáš zatím žádné auto</p>}
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
              Smazat
            </button>
          </div>
        ))}
      </div>

      {/* Add car*/}
      <div style={{ marginTop: "20px" }}>
        <h4>Přidat nové auto</h4>
        <input
          type="text"
          placeholder="SPZ"
          value={newCarSpz}
          onChange={e => setNewCarSpz(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model auta"
          value={newCarModel}
          onChange={e => setNewCarModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kapacita baterie (kWh)"
          value={newCarBattery}
          onChange={e => setNewCarBattery(e.target.value)}
        />
        <button onClick={handleAddCar}>Přidat</button>
      </div>

      {selectedCarId && (
        <div style={{ marginTop: "20px" }}>
          <strong>Vybral jsi auto ID: {selectedCarId}</strong>
        </div>
      )}
    </div>
  );
}

export default CarsPanel;
