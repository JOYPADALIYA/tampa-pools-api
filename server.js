// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // make sure node-fetch is installed

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual credentials
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_STORE_DOMAIN = 'tampapoolsandspas.myshopify.com';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// ====== ROUTE: Home page check ======
app.get('/', (req, res) => {
  res.send('Tampa Pools API is live ✅');
});

// ====== ROUTE: Save Customer Profile Note (Old way) ======
app.post('/save-profile', async (req, res) => {
  const { customerId, note } = req.body;

  if (!customerId || !note) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers/${customerId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          note: note
        }
      })
    });

    if (response.ok) {
      return res.json({ message: 'Customer note updated successfully ✅' });
    } else {
      const errorData = await response.json();
      console.error('Shopify API Error (Save Note):', errorData);
      return res.status(500).json({ message: 'Failed to update customer note ❌' });
    }
  } catch (error) {
    console.error('Server error (Save Note):', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ====== ROUTE: Update Customer Metafields (NEW way) ======
app.post('/update-metafields', async (req, res) => {
  const { customerId, metafields } = req.body;

  if (!customerId || !metafields) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers/${customerId}/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({ metafields })
    });

    if (response.ok) {
      return res.json({ message: 'Customer metafields updated successfully ✅' });
    } else {
      const errorData = await response.json();
      console.error('Shopify API Error (Update Metafields):', errorData);
      return res.status(500).json({ message: 'Failed to update metafields ❌' });
    }
  } catch (error) {
    console.error('Server error (Update Metafields):', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ====== START Server ======
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
