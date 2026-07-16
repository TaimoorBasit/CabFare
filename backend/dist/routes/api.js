"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAvailability = __importStar(require("../controllers/admin_availabilityController"));
const adminConfig = __importStar(require("../controllers/admin_configController"));
const adminPricingMatrix = __importStar(require("../controllers/admin_pricing-matrixController"));
const adminRouteTemplates = __importStar(require("../controllers/admin_route-templatesController"));
const adminSeasonal = __importStar(require("../controllers/admin_seasonalController"));
const bookings = __importStar(require("../controllers/bookingsController"));
const hello = __importStar(require("../controllers/helloController"));
const quotesCalculate = __importStar(require("../controllers/quotes_calculateController"));
const pricingEngine_1 = require("../engines/pricingEngine");
const router = (0, express_1.Router)();
// Helper to bind handlers safely
const bindHandler = (controller, method) => {
    return controller[method] || ((req, res) => res.status(501).json({ error: 'Not implemented' }));
};
// Admin Config
router.get('/admin/config', bindHandler(adminConfig, 'getHandler'));
router.post('/admin/config', bindHandler(adminConfig, 'postHandler'));
// Fleet Economics calculation endpoint
router.post('/admin/economics', async (req, res) => {
    const dbData = req.body;
    try {
        const eco = (0, pricingEngine_1.fleetEconomics)(dbData);
        res.json(eco);
    }
    catch (e) {
        res.status(500).json({ error: 'Calculation failed' });
    }
});
// Admin Pricing Matrix
router.get('/admin/pricing-matrix', bindHandler(adminPricingMatrix, 'getHandler'));
router.post('/admin/pricing-matrix', bindHandler(adminPricingMatrix, 'postHandler'));
router.put('/admin/pricing-matrix', bindHandler(adminPricingMatrix, 'putHandler'));
router.delete('/admin/pricing-matrix', bindHandler(adminPricingMatrix, 'deleteHandler'));
// Admin Route Templates
router.get('/admin/route-templates', bindHandler(adminRouteTemplates, 'getHandler'));
router.post('/admin/route-templates', bindHandler(adminRouteTemplates, 'postHandler'));
router.put('/admin/route-templates', bindHandler(adminRouteTemplates, 'putHandler'));
router.delete('/admin/route-templates', bindHandler(adminRouteTemplates, 'deleteHandler'));
// Admin Seasonal
router.get('/admin/seasonal', bindHandler(adminSeasonal, 'getHandler'));
router.post('/admin/seasonal', bindHandler(adminSeasonal, 'postHandler'));
router.put('/admin/seasonal', bindHandler(adminSeasonal, 'putHandler'));
router.delete('/admin/seasonal', bindHandler(adminSeasonal, 'deleteHandler'));
// Admin Availability
router.get('/admin/availability', bindHandler(adminAvailability, 'getHandler'));
router.post('/admin/availability', bindHandler(adminAvailability, 'postHandler'));
router.delete('/admin/availability', bindHandler(adminAvailability, 'deleteHandler'));
// Bookings
router.get('/bookings', bindHandler(bookings, 'getHandler'));
router.post('/bookings', bindHandler(bookings, 'postHandler'));
router.delete('/bookings', bindHandler(bookings, 'deleteHandler'));
router.put('/bookings', bindHandler(bookings, 'putHandler'));
// Quotes
router.post('/quotes/calculate', bindHandler(quotesCalculate, 'postHandler'));
// Hello
router.get('/hello', bindHandler(hello, 'getHandler'));
exports.default = router;
