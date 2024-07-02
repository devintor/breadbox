const express = require('express');
const { PrismaClient } = require('@prisma/client');
// const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const PORT = 3000

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });

// route to create new user
app.post('/users', async (req, res) => {
    const { firstName, lastName, email, uid, profileURL} = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Account already in use' });
     }
    const newUser = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            uid,
            profileURL
        },
    });
    res.json(newUser);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});