// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// import primaryRouter from 'src/controller/primary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = (process.env.NODE_ENV || 'production').toLowerCase();
const PORT = process.env.PORT || 3000;

// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

// Create an instance of an Express application
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Global template variables middleware
 * 
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    // Add current year for copyright
    res.locals.currentYear = new Date().getFullYear();
    // Continue to the next middleware or route handler
    next();
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route
});
// Global middleware for time-based greeting
app.use((req, res, next) => {
    const currentHour = new Date().getHours();
    let greeting = "";

    /**
     * Create logic to set different greetings based on the current hour.
     * Use res.locals.greeting to store the greeting message.
     * Hint: morning (before 12), afternoon (12-17), evening (after 17)
     */
    if (currentHour < 12) {
        greeting = "Good morning, welcome to my website!";
    } else if (currentHour >= 12 && currentHour <=17) {
        greeting = "Good afternoon, welcome to my website!";
    } else {
        greeting = "Good evening, welcome to my website!";
    }

    res.locals.greeting = greeting;
    next();
});
// Global middleware for random theme selection
app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme'];

    // Your task: Pick a random theme from the array
    const randomTheme = themes[Math.floor(Math.random() * 3)];
    res.locals.bodyClass = randomTheme;

    next();
});

// Global middleware to share query parameters with templates
app.use((req, res, next) => {
    // Your task: Make req.query available to all templates
    // Add it to res.locals so templates can access query parameters
    res.locals.queryParams = req.query;

    next();
});

// Route-specific middleware that sets custom headers
const addDemoHeaders = (req, res, next) => {
    // Your task: Set custom headers using res.setHeader()
    // Add a header called 'X-Demo-Page' with value 'true'
    res.setHeader('X-Demo-Page', 'true');
    // Add a header called 'X-Middleware-Demo' with any message you want
    res.setHeader('X-Middleware-Demo', 'Beware the middleware demo! If you are not cautious, you may meet your end!')

    next();
};


// app.use('/', primaryRouter);
// app.use('/about', primaryRouter);
// app.use('/products', primaryRouter);
// app.use('/catalog', primaryRouter);

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});
app.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});
app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});

// Course catalog list page
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});

// Enhanced course detail route with sorting
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'time';

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    // Sort based on the parameter
    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});

// Demo page route with header middleware
app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});



// Catch-all rout for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
})

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occured:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error', 
    error: err.message, 
    stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
})

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});