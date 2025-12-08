const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage: storage });

// POST /api/listings - accepts multipart/form-data with fields and images
app.post('/api/listings', upload.array('images', 12), (req, res) => {
  try {
    const body = req.body || {};
    const files = (req.files || []).map(f => ({
      filename: f.filename,
      path: '/uploads/' + f.filename,
      originalname: f.originalname,
      size: f.size
    }));

    const listing = {
      id: Date.now().toString(36),
      title: body.title || '',
      city: body.city || '',
      type: body.type || '',
      bedrooms: body.bedrooms || '',
      bathrooms: body.bathrooms || '',
      rent: body.rent || '',
      pincode: body.pincode || '',
      contactName: body.contactName || '',
      contactEmail: body.contactEmail || '',
      contactPhone: body.contactPhone || '',
      description: body.description || '',
      files: files,
      createdAt: Date.now()
    };

    const filePath = path.join(DATA_DIR, 'listings.json');
    let items = [];
    if (fs.existsSync(filePath)) {
      try { items = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]'); } catch (e) { items = []; }
    }
    items.push(listing);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');

    res.json({ success: true, id: listing.id, listing });
  } catch (err) {
    console.error('Error saving listing', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/listings - returns saved listings (for dev/test)
app.get('/api/listings', (req, res) => {
  const filePath = path.join(DATA_DIR, 'listings.json');
  if (!fs.existsSync(filePath)) return res.json([]);
  try {
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    res.json(items);
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not read listings' });
  }
});

app.listen(PORT, () => {
  console.log(`Nestori dev server listening on http://localhost:${PORT}`);
});
