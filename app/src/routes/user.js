const express = require('express');
const router = express.Router();
const Descope = require('@descope/node-sdk');  // Correct import

// Initialize Descope SDK
const descope = Descope({
  projectId: process.env.DESCOPE_PROJECT_ID, 
  managementKey: process.env.DESCOPE_MANAGEMENT_KEY 
});

// Define the root route ("/") to list users
router.get('/', async (req, res) => {
  try {
    // Fetch all users using the Descope SDK's admin API
    const result = await descope?.management?.user?.searchAll(); // Assuming 'searchAll' is correct method

    if (!result?.ok) {
        throw new Error(result?.error?.errorDescription || "Unknown Error Occured")
    }

    // Send the list of users as a JSON response
    res.json(result.data);  // Assuming result.data is the actual data array
  } catch (error) {
    console.error('Error fetching users:', error);

    // Optionally, send the error details for debugging purposes (in production, avoid this)
    res.status(500).send({
      message: 'Error fetching users',
      error: error.message || 'Unknown error',
    });
  }
});

module.exports = router;
