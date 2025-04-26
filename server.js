// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // make sure you install node-fetch

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual Admin API Token
const SHOPIFY_ADMIN_API_TOKEN = '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';
// Replace this with your actual Shopify Store domain (without https://)
const SHOPIFY_STORE_DOMAIN = 'tampapoolsandspas.myshopify.com';

app.use(cors());
app.use(bodyParser.json());

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
      return res.json({ message: 'Customer note updated successfully' });
    } else {
      const errorData = await response.json();
      console.error('Shopify error:', errorData);
      return res.status(500).json({ message: 'Failed to update customer' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Tampa Pools API is live ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
