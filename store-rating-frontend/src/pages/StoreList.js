import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StoreList() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/stores`)
      .then((res) => setStores(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Store List</h2>
      {stores.map((store) => (
        <div key={store.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{store.name}</h3>
          <p>{store.address}</p>
          <p>Rating: {store.avg_rating || "No ratings yet"}</p>
        </div>
      ))}
    </div>
  );
}
