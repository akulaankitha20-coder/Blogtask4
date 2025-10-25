import React, { useState, useEffect } from "react";
import axios from "./api";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const token = localStorage.getItem("token");

  const getPosts = async () => {
    const res = await axios.get("/posts");
    setPosts(res.data);
  };

  const createPost = async () => {
    await axios.post("/posts", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getPosts();
  };

  useEffect(() => { getPosts(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Blog</h1>
      {token && (
        <div>
          <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Content" onChange={e => setForm({ ...form, content: e.target.value })} />
          <button onClick={createPost}>Create</button>
        </div>
      )}
      <ul>
        {posts.map(p => (
          <li key={p._id} className="border p-2 mt-2">
            <h2>{p.title}</h2>
            <p>{p.content}</p>
            <small>{p.author?.name}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
