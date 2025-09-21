const LOGIN_URL = "http://localhost:8080/api/auth";
const USERS_URL = "http://localhost:8080/api/users";
const CAR_URL = "http://localhost:8080/api/cars";
const STATIONS_URL = "http://localhost:8080/api/stations";
const RESERVATIONS_URL = "http://localhost:8080/api/reservations";

// --- User and Login ---
export const registerUser = async (user) => {
  const response = await fetch(`${LOGIN_URL}/register`, {
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
  const response = await fetch(`${LOGIN_URL}/login`, {
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


export const deleteUser = async (userId, requesterId) => {
  const response = await fetch(`${USERS_URL}/${userId}?requesterId=${requesterId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Delete user error");
  }
};


// --- Stations ---
export const getStations = async () => {
  const response = await fetch(STATIONS_URL);
  if (!response.ok) throw new Error("Error fetching stations");
  return response.json();
};

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

export const deleteStation = async (stationId) => {
  const response = await fetch(`${STATIONS_URL}/${stationId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Delete station error");
};

// --- Cars ---
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

// --- Reservations ---
export const getAvailableStations = async (startTime) => {
  const response = await fetch(`${STATIONS_URL}/available?startTime=${encodeURIComponent(startTime)}`);
  if (!response.ok) throw new Error("Error fetching available stations");
  return response.json();
};

export const getCarById = async (carId) => {
  const response = await fetch(`${CAR_URL}/${carId}`);
  if (!response.ok) throw new Error("Error fetching car by ID");
  return response.json();
};

export const createReservation = async (payload) => {
  const response = await fetch(RESERVATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    throw new Error("This station is already reserved in this time range");
  }
  if (!response.ok) throw new Error("Error creating reservation");

  return response.json();
};

export async function getReservationsByUser(userId) {
  const res = await fetch(`${RESERVATIONS_URL}?userId=${userId}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chyba ${res.status}: ${text}`);
  }
  return res.json();
}

export async function deleteReservationById(id) {
  const res = await fetch(`${RESERVATIONS_URL}/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chyba ${res.status}: ${text}`);
  }
  return true;
}

