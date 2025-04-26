// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // make sure you install node-fetch

const app = express();
const PORT = process.env.PORT || 3000;

// Shopify credentials
const SHOPIFY_ADMIN_API_TOKEN = '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';
const SHOPIFY_STORE_DOMAIN = 'tampapoolsandspas.myshopify.com';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Route to check if server live
app.get('/', (req, res) => {
  res.send('Tampa Pools API is live ✅');
});

// ===== SAVE METAFIELDS Route =====
app.post('/save-metafields', async (req, res) => {
  const { customerId, metafields } = req.body;

  if (!customerId || !metafields) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const metafieldsArray = Object.keys(metafields).map(key => ({
      key: key,
      namespace: 'pool_profile', // you can change namespace if you want
      value: metafields[key],
      type: 'single_line_text_field'
    }));

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers/${customerId}/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN
      },
      body: JSON.stringify({ metafields: metafieldsArray })
    });

    if (response.ok) {
      return res.json({ message: 'Metafields saved successfully' });
    } else {
      const errorData = await response.json();
      console.error('Shopify error:', errorData);
      return res.status(500).json({ message: 'Failed to save metafields' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
