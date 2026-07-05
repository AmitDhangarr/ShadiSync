export default async function financialGatewayRoute(req, res) {
  return res.json({
    "success": true,
    "message": "ShaadiSync Financial Gateway Services",
    "status": "healthy",
    "modules": {
      "budget": {
        "base_path": "/api/v1/host/expense/budget",
        "description": "Event overall allocations, cost estimations, and target limit tracking."
      },
      "expense": {
        "base_path": "/api/v1/expense",
        "description": "Log vendor fees, line-item expenditures, and physical gift log management."
      },
      "payment": {
        "base_path": "/api/v1/expense/payment",
        "description": "Track cash/UPI ledger transactions, verify references, and monitor settlement statuses."
      }
    }
  });
}