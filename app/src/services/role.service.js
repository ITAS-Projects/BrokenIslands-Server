const getAll = async (descope, data) => {
    try {
        const result = await descope?.management?.role?.loadAll();
        
        if (!result?.ok) {
            throw new Error(result?.error?.errorDescription || "Unknown Error Occured")
        }
        
        return result.data;  // Assuming result.data is the actual data array
    } catch (error) {
        console.error('Error fetching roles:', error);
        
        throw new Error(error);
    }
};

module.exports = {
  getAll,
};