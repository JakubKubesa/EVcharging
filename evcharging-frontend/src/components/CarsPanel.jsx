import React, { useEffect, useState } from "react";
import CreateReservation from "./CreateReservation";
import ReservationList from "./ReservationList";
import { getCarsForUser, addCar, deleteCar } from "../services/api";


function CarsPanel({ user }) {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [newCarSpz, setNewCarSpz] = useState("");
  const [newCarBattery, setNewCarBattery] = useState("");
  const [newCarModel, setNewCarModel] = useState("");
  const [reservationRefresh, setReservationRefresh] = useState(0); 

  // load car for user
  useEffect(() => {
    if (user?.id) {
      getCarsForUser(user.id)
        .then(setCars)
        .catch(err => console.error("Loading car error:", err));
    }
  }, [user]);


  // add car
  const handleAddCar = () => {
    if (!newCarSpz || !newCarBattery || !newCarModel) return;

    const carData = {
      spz: newCarSpz,
      batteryCapacityKwh: parseInt(newCarBattery),
      model: newCarModel
    };

    addCar(user.id, carData)
      .then(car => {
        setCars([...cars, car]);
        setNewCarSpz("");
        setNewCarBattery("");
        setNewCarModel("");
      })
      .catch(err => console.error("Add car error:", err));
  };


  // delete car
  const handleDeleteCar = (carId) => {
    deleteCar(carId)
      .then(() => setCars(cars.filter(car => car.id !== carId)))
      .catch(err => console.error("Delete car error:", err));
  };


  return (
    <div>
      <h2>My cars</h2>

      {/* Choose car */}
      <div>
        <h4>Choose car for reservation</h4>
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
              className="button-delete"
              style={{ marginLeft: "12px" }}
              onClick={() => handleDeleteCar(car.id)}
            >
              Delete
            </button>
          </div>
        ))}

        {selectedCarId && (
          <CreateReservation
            selectedCarId={selectedCarId}
            user={user}
            onCreated={() => setReservationRefresh(prev => prev + 1)}
          />
        )}
      </div>
      
      <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
        <ReservationList user={user} refreshTrigger={reservationRefresh}/>
      </div>

      {/* Add car*/}
      <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
        <h4>Add new car</h4>
        <input
          type="text"
          placeholder="Licence plate number"
          value={newCarSpz}
          onChange={e => setNewCarSpz(e.target.value)}
          required
        />
        <br></br>
        <input
          type="text"
          placeholder="Car model"
          value={newCarModel}
          onChange={e => setNewCarModel(e.target.value)}
          required
        />
        <br></br>
        <input
          type="number"
          placeholder="Battery capacity (kWh)"
          value={newCarBattery}
          onChange={e => setNewCarBattery(e.target.value)}
          required
        />
        <br></br>
        <button className="button button-add" onClick={handleAddCar}>Add</button>
      </div>
    </div>
  );
}

export default CarsPanel;
