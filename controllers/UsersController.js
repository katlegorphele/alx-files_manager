import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';

class UsersController {
    static async postNew(req, res) {
        try {
            const { email, password } = req.body;
            if (!email) return res.status(400).json({ error: 'Missing email' });
            if (!password) return res.status(400).json({ error: 'Missing password' });

            const users = await dbClient.db.collection('users')
            const user = await dbClient.users.findOne({ email });
            if (user) return res.status(400).json({ error: 'Already exist' });

            const hashPassword = sha1(password);
            const result = await dbClient.users.insertOne({ 
                email, 
                password : hashPassword });
            return res.status(201).json({ id: result.insertedId, email });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async getMe(req, res) {
        try {
            const token = req.header('X-Token');
            if (!token) return res.status(401).json({ error: 'Unauthorized' });
            const userID = await redisClient.get(`auth_${token}`);
            if (!userID) return res.status(401).json({ error: 'Unauthorized' });
            const user = await dbClient.users.findOne({ _id: ObjectId(userID) });
            const Objd = new ObjectId(user._id);
            if (!user) return res.status(404).json({ error: 'Unauthorized' });
            return res.status(200).json({ id: user.id, email: user.email });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    }
}

export default UsersController;