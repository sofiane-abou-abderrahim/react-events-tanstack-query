import fs from 'node:fs/promises';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// CORS configuration to allow requests from any origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  next();
});

// Log every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route to fetch events
app.get('/api', async (req, res) => {
  const { max, search } = req.query;
  console.log(
    `Received request for events with max: ${max}, search: ${search}`
  );
  try {
    const eventsFilePath = path.join(__dirname, 'data/events.json');
    console.log('Reading events from:', eventsFilePath);
    const eventsFileContent = await fs.readFile(eventsFilePath);
    console.log('Events file content read successfully');
    let events = JSON.parse(eventsFileContent);
    console.log(`Parsed ${events.length} events`);

    if (search) {
      events = events.filter(event => {
        const searchableText = `${event.title} ${event.description} ${event.location}`;
        return searchableText.toLowerCase().includes(search.toLowerCase());
      });
      console.log(
        `Filtered events by search term, found ${events.length} events`
      );
    }

    if (max) {
      events = events.slice(events.length - max, events.length);
      console.log(
        `Limited events to max ${max}, returning ${events.length} events`
      );
    }

    res.json({
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        image: event.image,
        date: event.date,
        location: event.location
      }))
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events.' });
  }
});

// Route to fetch images
app.get('/api/images', async (req, res) => {
  try {
    const imagesFilePath = path.join(__dirname, 'data/images.json');
    console.log('Reading images from:', imagesFilePath);
    const imagesFileContent = await fs.readFile(imagesFilePath);
    const images = JSON.parse(imagesFileContent);
    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images.' });
  }
});

// Route to fetch a single event by ID
app.get('/api/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const eventsFilePath = path.join(__dirname, 'data/events.json');
    const eventsFileContent = await fs.readFile(eventsFilePath);
    const events = JSON.parse(eventsFileContent);
    const event = events.find(event => event.id === id);

    if (!event) {
      return res
        .status(404)
        .json({ message: `For the id ${id}, no event could be found.` });
    }

    setTimeout(() => {
      res.json({ event });
    }, 1000);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event.' });
  }
});

// Route to add a new event
app.post('/api', async (req, res) => {
  const { event } = req.body;

  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }

  if (
    !event.title?.trim() ||
    !event.description?.trim() ||
    !event.date?.trim() ||
    !event.time?.trim() ||
    !event.image?.trim() ||
    !event.location?.trim()
  ) {
    return res.status(400).json({ message: 'Invalid data provided.' });
  }

  try {
    const eventsFilePath = path.join(__dirname, 'data/events.json');
    const eventsFileContent = await fs.readFile(eventsFilePath);
    const events = JSON.parse(eventsFileContent);

    const newEvent = {
      id: Math.round(Math.random() * 10000).toString(),
      ...event
    };

    events.push(newEvent);

    await fs.writeFile(eventsFilePath, JSON.stringify(events));

    res.json({ event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event.' });
  }
});

// Route to update an existing event
app.put('/api/:id', async (req, res) => {
  const { id } = req.params;
  const { event } = req.body;

  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }

  if (
    !event.title?.trim() ||
    !event.description?.trim() ||
    !event.date?.trim() ||
    !event.time?.trim() ||
    !event.image?.trim() ||
    !event.location?.trim()
  ) {
    return res.status(400).json({ message: 'Invalid data provided.' });
  }

  try {
    const eventsFilePath = path.join(__dirname, 'data/events.json');
    const eventsFileContent = await fs.readFile(eventsFilePath);
    const events = JSON.parse(eventsFileContent);

    const eventIndex = events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    events[eventIndex] = {
      id,
      ...event
    };

    await fs.writeFile(eventsFilePath, JSON.stringify(events));

    setTimeout(() => {
      res.json({ event: events[eventIndex] });
    }, 1000);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event.' });
  }
});

// Route to delete an event by ID
app.delete('/api/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const eventsFilePath = path.join(__dirname, 'data/events.json');
    const eventsFileContent = await fs.readFile(eventsFilePath);
    const events = JSON.parse(eventsFileContent);

    const eventIndex = events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    events.splice(eventIndex, 1);

    await fs.writeFile(eventsFilePath, JSON.stringify(events));

    setTimeout(() => {
      res.json({ message: 'Event deleted' });
    }, 1000);
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event.' });
  }
});

// Route to serve the React app's index.html for any non-API request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  console.error(`Error: ${status} - ${message}`);
  res.status(status).json({ message: message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
