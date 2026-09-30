import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { REAL_GOVT_SCHEMES } from './data/schemes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Get All Schemes / Safe Dynamic Filter Schemes
app.get('/api/schemes', (req, res) => {
  try {
    const { state, education, search, category } = req.query;
    
    let filtered = [...REAL_GOVT_SCHEMES];

    // 1. Safe State Filter (ফাঁকা বা 'All' থাকলে স্কিপ করবে)
    if (state && state !== 'All' && state.trim() !== '') {
      filtered = filtered.filter(s => 
        s.state?.toLowerCase() === state.toLowerCase() || 
        s.state === 'All India (Central)' ||
        s.state === 'All'
      );
    }

    // 2. Safe Education Filter
    if (education && education !== 'All' && education.trim() !== '') {
      filtered = filtered.filter(s => {
        if (!s.educationRequired) return true;
        if (Array.isArray(s.educationRequired)) {
          if (education === 'None') return s.educationRequired.includes('None');
          return !s.educationRequired.includes('None') || s.educationRequired.includes('Students') || s.educationRequired.includes('All');
        }
        return true;
      });
    }

    // 3. Safe Category Filter
    if (category && category !== 'All' && category.trim() !== '') {
      filtered = filtered.filter(s => 
        s.category?.toLowerCase().trim() === category.toLowerCase().trim()
      );
    }

    // 4. Search Filter
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(s => 
        s.title?.toLowerCase().includes(q) || 
        s.category?.toLowerCase().includes(q) ||
        s.eligibility?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ success: false, message: 'Server error fetching schemes.' });
  }
});

// Single Scheme Info
app.get('/api/schemes/:id', (req, res) => {
  const scheme = REAL_GOVT_SCHEMES.find(s => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ success: false, message: 'Scheme not found.' });
  }
  res.json({ success: true, data: scheme });
});

// Endpoint explaining the portal redirection status
app.post('/api/applications/redirect-info', (req, res) => {
  const { schemeId } = req.body;
  const scheme = REAL_GOVT_SCHEMES.find(s => s.id === schemeId);

  if (!scheme) {
    return res.status(404).json({ success: false, message: 'Scheme not found.' });
  }

  res.json({
    success: true,
    schemeId: scheme.id,
    officialUrl: scheme.officialUrl,
    integrationNote: "Official state portals require direct submission on their domain. Application tracking in this portal monitors external click logs."
  });
});

app.listen(PORT, () => {
  console.log(`Gov Scheme Assistant Backend running on http://localhost:${PORT}`);
});