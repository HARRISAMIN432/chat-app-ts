import jwt from 'jwt'
import User from '../models/User';

const authMiddleware = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({
                message: "Not authorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select("-password")
        next()
    }
    catch(e) {
        console.error(error)
        res.status(401).json({
            message: "Not authorized"
        })
    }
}

export default authMiddleware