const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// In-memory storage for rooms and bookings (Replace with a database in a real-world scenario)
let rooms = [];
let bookings = [];

// API Endpoints

// 1. Create a Room
app.post('/rooms', (req, res) => {
    const { name, seats, amenities, pricePerHour } = req.body;
    const newRoom = { id: rooms.length + 1, name, seats, amenities, pricePerHour };
    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

// 2. Book a Room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find((r) => r.id === roomId);

    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    const newBooking = {
        id: bookings.length + 1,
        customerName,
        date,
        startTime,
        endTime,
        roomId,
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
});

// 3. List all Rooms with Booked Data
app.get('/rooms/bookings', (req, res) => {
    const result = rooms.map((room) => {
        const bookingsForRoom = bookings.filter((booking) => booking.roomId === room.id);
        return {
            roomName: room.name,
            bookedStatus: bookingsForRoom.length > 0,
            bookings: bookingsForRoom,
        };
    });
    res.json(result);
});

// 4. List all Customers with Booked Data
app.get('/customers/bookings', (req, res) => {
    const result = bookings.map((booking) => {
        const room = rooms.find((r) => r.id === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: room.name,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });
    res.json(result);
});

// 5. List how many times a customer has booked the room
app.get('/customer/bookings/:customerName', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookings = bookings.filter((booking) => booking.customerName === customerName);

    res.json(customerBookings);
});

// Default route handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Hall Booking API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
