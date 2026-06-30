export default async function hostDashboardRoute(req, res) {
  return res.json({
    success: true,
    message: "ShaadiSync Host Dashboards Gateway",
    status: "healthy",
    endpoints: {
      event: {
        method: "GET",
        path: "/api/v1/host/dashboard/event",
        description: "Retrieve overview and metrics for host events.",
      },
      invitation: {
        method: "GET",
        path: "/api/v1/host/dashboard/invitation",
        description: "Retrieve analytics and status for event invitations.",
      },
      expense: {
        method: "GET",
        path: "/api/v1/host/dashboard/expense",
        description: "Retrieve budget breakdown and expense tracking data.",
      },
      gift: {
        method: "GET",
        path: "/api/v1/host/dashboard/gifts",
        description: "Retrieve registry details and received gifts tracking.",
      },
    },
  });
}