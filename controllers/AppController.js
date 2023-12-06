import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController{
    static getStatus(req, res) {
        res
            .status(200)
            .send({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
    }

    static async getStats(req, res) {
        try{
            const users = await dbClient.nbUsers();
            const files = await dbClient.nbFiles();
            res.status(200).send({ users, files });
        } catch (err) {
            res.status(500).send({ users: 0, files: 0 });
        }
    }
}

export default AppController;