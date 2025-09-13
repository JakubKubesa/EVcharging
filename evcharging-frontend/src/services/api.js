const API_URL = "http://localhost:8080/api/auth";
const USERS_URL = "http://localhost:8080/api/users";
const CAR_URL = "http://localhost:8080/api/cars";
const STATIONS_URL = "http://localhost:8080/api/stations";


export const registerUser = async (user) => {
  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user.username,
      email: user.email,
      passwordHash: user.password, 
      role: "USER"
    }),
  });
  return await response.json();
};


export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      passwordHash: credentials.password
    })
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}

export const getUsers = async () => {
  const response = await fetch(USERS_URL);
  return await response.json();
};


export const deleteUser = async (userId) => {
  const response = await fetch(`${USERS_URL}/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Delete user error");
  }
};

//---

export const addChargingStation = async (station) => {
  const response = await fetch(STATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: station.name,
      powerKw: station.powerKw,
      active: station.active ?? true
    })
  });

  if (!response.ok) {
    throw new Error("Adding station error");
  }

  return await response.json();
};

//---

export const addCar = async (userId, car) => {
  const response = await fetch(`${CAR_URL}/add/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car)
  });
  return response.json();
};
 
export const getCarsForUser = async (userId) => {
  const response = await fetch(`${CAR_URL}/user/${userId}`);
  return response.json();
};

export const deleteCar = async (carId) => {
  await fetch(`${CAR_URL}/${carId}`, { method: "DELETE" });
};