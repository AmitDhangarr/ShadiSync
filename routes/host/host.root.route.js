export default async function hostrootRoute(req, res) {
  return res.json({
    success: true,
    message: "ShaadiSync Host Gateway",
    status: "healthy",
    description:
      "Base access point for wedding hosts and organizers.",
    links: {
      dashboard: "/api/v1/host/dashboard",
    },
  });
}
