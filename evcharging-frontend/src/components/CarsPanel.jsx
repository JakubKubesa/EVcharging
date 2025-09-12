import React, { useEffect, useState } from "react";

function CarsPanel({ user }) {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [newCarSpz, setNewCarSpz] = useState("");
  const [newCarBattery, setNewCarBattery] = useState("");

  // Načtení aut aktuálního uživatele
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/cars/user/${user.id}`)
        .then(res => res.json())
        .then(data => setCars(data))
        .catch(err => console.error("Chyba při načítání aut:", err));
    }
  }, [user]);

  // Přidání auta
  const handleAddCar = () => {
    if (!newCarSpz || !newCarBattery) return;

    // Posíláme DTO objekt
    fetch(`http://localhost:8080/api/cars/add/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spz: newCarSpz,
        batteryCapacityKwh: parseInt(newCarBattery)
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
      })
      .catch(err => console.error(err));
  };

  // Mazání auta
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

      {/* Výběr auta */}
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
              {car.spz} ({car.batteryCapacityKwh} kWh)
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

      {/* Přidání auta */}
      <div style={{ marginTop: "20px" }}>
        <h4>Přidat nové auto</h4>
        <input
          type="text"
          placeholder="SPZ"
          value={newCarSpz}
          onChange={e => setNewCarSpz(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kapacita baterie (kWh)"
          value={newCarBattery}
          onChange={e => setNewCarBattery(e.target.value)}
        />
        <button onClick={handleAddCar}>Přidat</button>
      </div>

      {/* Zvolený výběr auta */}
      {selectedCarId && (
        <div style={{ marginTop: "20px" }}>
          <strong>Vybral jsi auto ID: {selectedCarId}</strong>
        </div>
      )}
    </div>
  );
}

export default CarsPanel;
