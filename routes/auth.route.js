export default async function authRoute(req, res) {
  return res.json({
  "success": true,
  "message": "ShaadiSync Authentication Gateway",
  "status": "healthy",
  "endpoints": {
    "register": {
      "method": "POST",
      "path": "/api/v1/auth/register",
      "description": "Create a new organizer or guest account."
    },
    "login": {
      "method": "POST",
      "path": "/api/v1/auth/login",
      "description": "Authenticate credentials and receive an access token."
    }
  }
});
}