const db = require('../models');

const getAll = async (descope) => {
    try {
        // Fetch all users using the Descope SDK's admin API
        const result = await descope?.management?.user?.searchAll(); // Assuming 'searchAll' is correct method

        if (!result?.ok) {
            throw new Error(result?.error?.errorDescription || "Unknown Error Occured")
        }

        // Send the list of users as a JSON response
        return result.data;  // Assuming result.data is the actual data array
    } catch (error) {
        console.error('Error fetching users:', error);

        // Optionally, send the error details for debugging purposes (in production, avoid this)
        throw new Error(error);
    }
};

const getById = async (id) => {
  return false;
};


const create = async (data) => {
  return false;
};


const update = async (id, data) => {
  return false;
};



const deleteOne = async (id) => {
  return false;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteOne
};
