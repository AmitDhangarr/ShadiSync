import { Router } from "express";
const router = Router();

 async function rootRoute(req, res) {
  return res.json({
    success: true,
    app_name: "ShadiSync",
    version: "1.0.0",
    status: "healthy",
    description:
      "An all-in-one event management system for handling events, invitations, gifts, and expenses.",
    links: {
      documentation: "https://docs.shadisync.com",
      register: "/api/v1/auth/register",
      login: "/api/v1/auth/login",
    },
  });
}


export default rootRoute;