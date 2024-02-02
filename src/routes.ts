import { Router } from "express";
import UserController from "../src/controllers/userController";

const routes = Router();

routes.post("/createUser", new UserController().createUser);

export default routes;
