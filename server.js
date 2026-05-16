const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// GET data.json
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST/UPDATE data.json
app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Write to file
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    
    res.json({ 
      success: true, 
      message: 'Data saved successfully!' 
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ 
      error: 'Failed to save data', 
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ keyshotit.media server running on http://localhost:${PORT}`);
  console.log(`✓ Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`✓ Website: http://localhost:${PORT}`);
});
