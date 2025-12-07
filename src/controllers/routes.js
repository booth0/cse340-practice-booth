import { Router } from 'express';
// Create a new router instance
const router = Router();

// Import middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';

import { departmentsPage } from './catalog/departments.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { notFoundHandler, globalErrorHandler } from './errors.js';

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);
router.get('/departments', departmentsPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

// Error handlers (these should be registered last)
router.use(notFoundHandler);
router.use(globalErrorHandler);

export default router;