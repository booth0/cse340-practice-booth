// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
 
// Create an instance of an Express application
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = 'Home Page';
    const content = '<h1>Welcome to the Home Page</h1><p>This is the main content of the home page.</p>';
    res.render('index', { title, content, NODE_ENV, PORT });
});
app.get('/about', (req, res) => {
    const title = 'About Me';
    const content = `
        <h1>About Me</h1>
        <p>My name is Adam Booth. I'm from Mesa, AZ, but am currently living in Rexburg with my wife Scarlet while I finish up my Software Engineering degree. We got sealed in the Mesa Temple last August and married life has been great! I really enjoy playing with video games as well as fixing and modding old consoles.</p>`;
    res.render('index', { title, content, NODE_ENV, PORT });
});
app.get('/contact', (req, res) => {
    const title = 'Contact Us';
    const content = `  
        <h1>Contact Us</h1>
        <form action="/submit" method="POST">
            <input type="text" name="name" placeholder="Name"><br>
            <input type="email" name="email" placeholder="Email"><br>
            <textarea name="message" placeholder="Message"></textarea><br>
            <input type="submit" value="Submit">
        </form>`;
    res.render('index', { title, content, NODE_ENV, PORT });
});
 
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

 