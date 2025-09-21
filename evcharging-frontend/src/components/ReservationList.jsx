import { useEffect, useState } from "react";
import { getReservationsByUser, deleteReservationById } from "../services/api";

export default function ReservationList({ user , refreshTrigger }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reservation by user id
  useEffect(() => {
    if (!user?.id) return;
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await getReservationsByUser(user.id);
        setReservations(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user, refreshTrigger]);

  // delete reservation by id
  const handleDeleteReservation = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteReservationById(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Načítání...</p>;
  if (error) return <p style={{ color: "red" }}>Chyba: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reservation list</h2>
      {reservations.length === 0 ? (
        <p>Žádné rezervace</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Charging station</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.station?.name || "—"}</td>
                <td className="border p-2">
                  {r.startTime ? new Date(r.startTime).toLocaleString() : "—"}
                </td>
                <td className="border p-2">
                  {r.endTime ? new Date(r.endTime).toLocaleString() : "—"}
                </td>
                <td className="border p-2">{r.status || "—"}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => handleDeleteReservation(r.id)} className="button-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
