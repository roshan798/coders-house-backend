import tokenService from "../services/tokenService.js";

export default async function (req, res, next) {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new Error();
        }
        const userData = await tokenService.verifyAccessToken(accessToken);
        if(!userData){
            throw new Error();
        }
        req.user = userData;
        console.log(userData);
    } catch (error) {
        console.log("inside auth middleware");
        // console.error(error);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
    next();
}