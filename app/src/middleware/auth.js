const Descope = require('@descope/node-sdk');

var descopeClient;
try{
    // baseUrl="http://localhost:3000/" // When initializing the Descope client, you can also configure the baseUrl ex: https://auth.company.com  - this is useful when you utilize a custom domain within your Descope project.
    descopeClient = Descope({ projectId: process.env.DESCOPE_PROJECT_ID });
} catch (error) {
    console.error("failed to initialize: " + error);
}

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token){
    return res.status(401).json({ error: 'Missing token in request' });
  } 

  if (descopeClient == undefined) {
    return res.status(401).json({ error: 'No Client, server needs a restart' })
  }

  try {
    const session = await descopeClient.validateSession(token);
    req.user = session;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const validateUserHasPermissions = (permissions) => { //[ 'User Admin', 'View People', 'View Reservation', 'Edit Reservation', 'View Taxi' ]
  return async (req, res, next) => {
    try {
      const isPermissionValid = await descopeClient.validatePermissions(req.user, permissions);

      if (isPermissionValid) {
        next();
      } else {
        return res.status(403).json({ error: 'User doesn\'t have permission' });
      }
    } catch (error) {
      console.error('Permission validation failed:', error);
      return res.status(401).json({ error: 'Invalid user' });
    }
  };
};


module.exports = { requireAuth, validateUserHasPermissions };
