import dbClient from '../utils/db';
import redisClient from '../utils/redis';
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
}

export default UsersController;