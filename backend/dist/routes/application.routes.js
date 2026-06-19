"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const application_controller_1 = require("../controllers/application.controller");
const router = (0, express_1.Router)();
// 🔒 All routes now pass through the JWT check first!
router.get('/', auth_middlewares_1.authenticateJWT, application_controller_1.getAllApplications);
router.get('/:id', auth_middlewares_1.authenticateJWT, application_controller_1.getApplicationById);
router.post('/', auth_middlewares_1.authenticateJWT, application_controller_1.createApplication);
router.patch('/:id', auth_middlewares_1.authenticateJWT, application_controller_1.updateApplication);
router.delete('/:id', auth_middlewares_1.authenticateJWT, application_controller_1.deleteApplication);
exports.default = router;
