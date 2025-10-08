import {courses} from "../model/catalog.js";
import express from 'express';

const router = express.Router();

// Define a route handler for the root URL ('/')
router.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});
router.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});
router.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});
// Course catalog list page
router.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});


export default router;
