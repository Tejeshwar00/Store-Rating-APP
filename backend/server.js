// In your existing backend/server.js file

// Add your mock data at the top (after other imports)
const mockStores = [
  {
    id: 1,
    name: "Tech World",
    category: "Electronics",
    location: "New York",
    rating: 4.5,
    reviews: [
      { id: 1, rating: 5, comment: "Great service!", user: "John D." },
      { id: 2, rating: 4, comment: "Good products", user: "Jane S." }
    ]
  },
  {
    id: 2,
    name: "Fashion Hub",
    category: "Clothing",
    location: "Los Angeles", 
    rating: 4.2,
    reviews: [
      { id: 1, rating: 4, comment: "Nice collection", user: "Mike R." }
    ]
  },
  {
    id: 3,
    name: "Book Corner",
    category: "Books",
    location: "Chicago",
    rating: 4.8,
    reviews: [
      { id: 1, rating: 5, comment: "Amazing bookstore!", user: "Sarah L." }
    ]
  },
  {
    id: 4,
    name: "Coffee Beans",
    category: "Food & Beverage",
    location: "Seattle",
    rating: 4.6,
    reviews: []
  }
];

// Add these API routes to your existing server
app.get('/api/stores', (req, res) => {
  res.json(mockStores);
});

app.get('/api/stores/search', (req, res) => {
  const { q } = req.query;
  const filtered = mockStores.filter(store => 
    store.name.toLowerCase().includes(q.toLowerCase()) ||
    store.category.toLowerCase().includes(q.toLowerCase()) ||
    store.location.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered);
});

app.get('/api/stores/:id', (req, res) => {
  const store = mockStores.find(s => s.id === parseInt(req.params.id));
  if (store) {
    res.json(store);
  } else {
    res.status(404).json({ error: 'Store not found' });
  }
});