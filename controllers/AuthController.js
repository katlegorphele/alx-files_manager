import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import sha1 from "sha1";
import { v4 } from 'uuid'

class AuthController {
    static async getConnect( req, res ) {
        const auth = req.header( 'Authorization' );
        const [email, password] = Buffer.from( auth.split( ' ' )[1], 'base64' ).toString().split( ':' );

        const UsersC = await dbClient.db.collection( 'users' );
        const hashedPass = sha1(password);
        const user = await UsersC.findOne({ email, password: hashedPass });

        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        if (user.password !== hashedPass) return res.status(401).json({ error: 'Unauthorized' });

        const token = v4();
        await redisClient.set(`auth_${token}`, user._id.toString(), 86400);
        return res.status(200).json({ token });
    }

    static async getDisconnect( req, res ) {
        const token = req.header('X-Token');
        const user = await redisClient.get(`auth_${token}`);

        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        await redisClient.del(`auth_${token}`);
        return res.status(204).json();
    }
} 

export default AuthController;