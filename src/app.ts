import express, { Application, Request, Response } from 'express';
import http from 'http';
import mongoose from 'mongoose';

// models
import userModel from './db/users';


const app: Application = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/Grater')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error : any) => console.error('MongoDB connection error:', error));

app.get('/api/signup/:username/:password', async (req: Request, res: Response) => {
    const { username, password } = req.params;
    console.log(`username: ${username}, password: ${password}`);

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const fetchData : any = await response.json();
        
        if (!fetchData.message) {
            const user = new userModel({
                username: fetchData.login,
                password: password,
                avatar_url: fetchData.avatar_url,
            });

            await user.save();
            console.log('User saved successfully');
            return res.status(200).json({ status: 'good' });
        } else {
            console.log('GitHub user not found');
            return res.status(404).json({ status: 'bad', message: 'GitHub user not found' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ status: 'bad', message: 'Internal server error' });
    }
});

http.createServer(app).listen(8080, () => {
    console.log('Listening on localhost:8080');
});