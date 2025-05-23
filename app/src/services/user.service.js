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

const getById = async (descope, id) => {
    try {
        // Fetch all users using the Descope SDK's admin API
        const result = await descope?.management?.user?.loadByUserId(id); // Assuming 'searchAll' is correct method
        if (!result?.ok) {
            throw new Error(result?.error?.errorDescription || "Unknown Error Occured")
        }
        
        // Send the list of users as a JSON response
        return result.data;  // Assuming result.data is the actual data array
    } catch (error) {
        console.error('Error fetching user:', error);
        
        // Optionally, send the error details for debugging purposes (in production, avoid this)
        throw new Error(error);
    }
};


const create = async (descope, data) => {

    try {
        // Fetch all users using the Descope SDK's admin API
        const result = await descope?.management?.user?.create(data?.email, {roles: data?.roles}); // Assuming 'searchAll' is correct method
        if (!result?.ok) {
            throw new Error(result?.error?.errorDescription || "Unknown Error Occured")
        }
        
        // Send the list of users as a JSON response
        return result.data;  // Assuming result.data is the actual data array
    } catch (error) {
        // Optionally, send the error details for debugging purposes (in production, avoid this)
        throw new Error(error);
    }
};


const update = async (descope, id, data) => {
    try {
        // Fetch all users using the Descope SDK's admin API
        const currentUser = await getById(descope, id);
        if (!currentUser?.userId) {
            throw new Error(currentUser?.error?.errorDescription || "Unknown Error Occured")
        }

        const result = await descope?.management?.user?.update(currentUser?.email, {roles: data?.roles, email: currentUser?.email, name: currentUser?.name}); // Assuming 'searchAll' is correct method
        if (!result?.ok) {
            throw new Error(result?.error?.errorDescription || "Unknown Error Occured")
        }
        
        // Send the list of users as a JSON response
        return result.data;  // Assuming result.data is the actual data array
    } catch (error) {
        // Optionally, send the error details for debugging purposes (in production, avoid this)
        throw new Error(error);
    }
};


const deleteMany = async (descope, ids) => {
    const results = [];

    for (const id of ids) {
        try {
            const result = await descope?.management?.user?.deleteByUserId(id);

            if (!result?.ok) {
                throw new Error(result?.error?.errorDescription || "Unknown Error Occured");
            }

            results.push({ id, success: true });
        } catch (err) {
            console.error(`Failed to delete user ${id}:`, err);
            results.push({ id, success: false, error: err.message });
        }
    }

    return results;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteMany
};
