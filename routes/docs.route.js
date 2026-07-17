import { Router } from "express";
const router = Router();

 async function docsRoute(req, res) {
  return res.status(200).render("docs");
}


export default docsRoute;