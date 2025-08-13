// StoreList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentRole } from "../auth/role";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getCurrentRole(); // SYSTEM_ADMIN | STORE_OWNER | NORMAL_USER | null
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/stores", {
          params: { search, minRating }
        });
        setStores(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, minRating]);

  if (loading) return <div className="p-4">Loading stores…</div>;

  if (!stores.length) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2>No stores yet</h2>
        {role === "SYSTEM_ADMIN" || role === "STORE_OWNER" ? (
          <>
            <p>Your list is empty. Add your first store to get started.</p>
            <a className="btn btn-primary" href="/stores/new">+ Add a Store</a>
          </>
        ) : (
          <>
            <p>Nothing here… but here are a few ideas:</p>
            <ul style={{ display:"grid", gap:"12px", maxWidth:600, margin:"0 auto" }}>
              <li className="card">Cafe Aroma — Try rating your favorite cafe.</li>
              <li className="card">Tech Hub Electronics — Review a recent purchase.</li>
            </ul>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="flex gap-2 items-center">
        <input
          placeholder="Search by name/email/address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={minRating} onChange={(e)=>setMinRating(e.target.value)}>
          <option value={0}>Any rating</option>
          <option value={3}>3★+</option>
          <option value={4}>4★+</option>
          <option value={4.5}>4.5★+</option>
        </select>
      </div>

      {/* List */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"16px" }}>
        {stores.map(s => (
          <div key={s.id} className="card" style={{ padding:"12px", border:"1px solid #eee", borderRadius:12 }}>
            <div style={{ fontWeight:600 }}>{s.name}</div>
            <div style={{ fontSize:13, color:"#666" }}>{s.email}</div>
            <div style={{ fontSize:13, color:"#666" }}>{s.address}</div>
            <div style={{ marginTop:8 }}>
              <strong>{s.avgRating}★</strong> ({s.ratingCount})
            </div>
            {(role === "SYSTEM_ADMIN" || role === "STORE_OWNER") && (
              <div className="mt-2 flex gap-8">
                <a href={`/stores/${s.id}/edit`}>Edit</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
