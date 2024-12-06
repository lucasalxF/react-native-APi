// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Dummy data to simulate items
const items = [
  { id: 1, title: 'Item 1', description: 'testando dados Da API' },
  { id: 2, title: 'Item 2', description: 'testando dados Da API item 2' },
];

// Route to get items
app.get('/api/items', (req, res) => {
  try {
    res.status(200).json(items); // Return items with a successful response (200)
  } catch (error) {
    console.error('Error while fetching items:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' }); // Send a 500 response if something goes wrong
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
