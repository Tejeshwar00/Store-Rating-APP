import React, { useEffect, useState } from "react";
import API from "../api";

export default function Home() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    API.get("/stores").then((res) => setStores(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Stores</h2>
      {stores.map((store) => (
        <div key={store.id} style={{ border: "1px solid black", margin: "5px", padding: "5px" }}>
          <h3>{store.name}</h3>
          <p>{store.address}</p>
        </div>
      ))}
    </div>
  );
}
