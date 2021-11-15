const express = require("express");
const routes = express.Router();

const AuthController = require("./controller/AuthController");
const ProjectController = require("./controller/ProjectController");

// Middlewares
const AuthMiddleware = require("./middlewares/auth");

// Auth
routes.post("/auth/register", AuthController.register);
routes.post("/auth/authenticate", AuthController.authenticate);

// Project
routes.get("/projects", AuthMiddleware, ProjectController.test);

module.exports = routes;
