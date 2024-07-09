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


  app.post('/users/auth', async (req, res) => {
    const { firstName, lastName, email, uid, profileURL} = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Account already in use' });
    }
    try {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
  });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});