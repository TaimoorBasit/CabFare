import { Router } from 'express';
import * as adminAvailability from '../controllers/admin_availabilityController';
import * as adminConfig from '../controllers/admin_configController';
import * as adminPricingMatrix from '../controllers/admin_pricing-matrixController';
import * as adminRouteTemplates from '../controllers/admin_route-templatesController';
import * as adminSeasonal from '../controllers/admin_seasonalController';
import * as authLogin from '../controllers/auth_loginController';
import * as authMe from '../controllers/auth_meController';
import * as authRegister from '../controllers/auth_registerController';
import * as bookings from '../controllers/bookingsController';
import * as dbTest from '../controllers/db-testController';
import * as hello from '../controllers/helloController';
import * as quotesCalculate from '../controllers/quotes_calculateController';
import * as syncLiveDb from '../controllers/sync-live-dbController';
import { getDatabase } from '../database/db';
import { fleetEconomics } from '../engines/pricingEngine';

const router = Router();

// Helper to bind handlers safely
const bindHandler = (controller: any, method: string) => {
    return controller[method] || ((req: any, res: any) => res.status(501).json({ error: 'Not implemented' }));
};

// Admin Config
router.get('/admin/config', bindHandler(adminConfig, 'getHandler'));
router.post('/admin/config', bindHandler(adminConfig, 'postHandler'));

// Fleet Economics calculation endpoint
router.post('/admin/economics', async (req, res) => {
    const dbData = req.body;
    try {
        const eco = fleetEconomics(dbData);
        res.json(eco);
    } catch (e) {
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

export default router;
