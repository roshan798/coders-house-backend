import otpService from '../services/otpService.js'
import HashService from '../services/hashService.js'
import userService from '../services/userService.js';
import tokenService from '../services/tokenService.js';
import UserDto from '../dtos/userDtos.js';

class authController {

    async sendOtp(req, res) {
        const { type, sender } = req.body;
        if (!sender) {
            return res.status(400).json({
                message: `${type} Field is required.`
            });
        }
        const otp = await otpService.generateOtp();
        const TTL = 1000 * 60 * 24 * 5;  // 1000ms * 1s * 5min TTL -> Total Time Left\
        const expires = Date.now() + TTL;
        // this data will be hashed and send back to the client and the OTP is sent to the clients mobile
        const data = `${sender}.${otp}.${expires}`;
        const hash = HashService.hashOtp(data);
        try {
            if (type === 'phone') {
                // const response = await otpService.sendBySMS(sender, otp);
                // console.log('twilo response');
                // console.log(response);
            }
            else {
                const response = await otpService.sendByEmail(sender, otp);
            }
            console.log(otp);
            return res.json({
                hash: `${hash}.${expires}`,
                sender,
                otp // remove
            })
        } catch (error) {
            // console.log(error);
            return res.status(500).json({
                message: "Failed to send otp"
            });
        }
    }



    async verifyOtp(req, res) {
        const { otp, hash, sender, type } = req.body;
        if (!sender || !otp || !hash) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > expires) {
            return res.status(400).json({
                message: "Otp expired"
            });
        }
        const data = `${sender}.${otp}.${expires}`;
        const isValid = otpService.verifyOtp(data, hashedOtp)
        if (isValid === false) {
            return res.status(400).json({
                message: "Incorrect otp!"
            });
        }
        let user;
        try {
            if (type === 'phone') {
                user = await userService.findUser({ phone: sender });
                if (!user) {
                    user = await userService.createUser({ phone: sender })
                }
            }
            else {
                user = await userService.findUser({ email: sender });
                if (!user) {
                    user = await userService.createUser({ email: sender })
                }
            }
        } catch (error) {
            return res.status(500).json({
                message: "Unable create user account",
                error,
            });
        }
        const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false });
        await tokenService.storeRefreshToken(refreshToken, user._id);
        /* 
       const { secure } = req;
     
       console.log("secure", secure);
     
       res.cookie('refreshToken', refreshToken, { sameSite: 'none', Secure: secure, maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
       res.cookie('accessToken', accessToken, { sameSite: 'none', Secure: secure, maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
     
      */

        //  for local host 
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            // sameSite: 'None', secure: true
        });
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            // sameSite: 'None', secure: true
        });

        // 
        // res.cookie('refreshToken', refreshToken, {
        //     maxAge: 1000 * 60 * 60 * 24 * 30,
        //     httpOnly: true,
        //     sameSite: 'None', secure: true
        // });
        // res.cookie('accessToken', accessToken, {
        //     maxAge: 1000 * 60 * 60 * 24 * 30,
        //     httpOnly: true,
        //     sameSite: 'None', secure: true
        // });
        const userDto = new UserDto(user);
        res.json({
            message: "OTP matched",
            user: userDto,
            auth: true,
        });
    }


    async refreshAccessToken(req, res) {
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        //check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token" })
        }
        //check if token is in database
        try {
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
            // console.log("userData->", userData, token);
            if (!token) {
                return res.status(401).json({ message: "Invalid Token" })
            }

        } catch (error) {
            // console.log(error);
            return res.status(501).json({ message: "Internal error" })
        }
        //check if valid user
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: "No user" })
        }
        //generate new token(both)
        const { refreshToken, accessToken } = tokenService.generateTokens({ _id: userData._id })
        //update refreshToken
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {
            // console.log(error);
            return res.status(501).json({ message: "Internal error" })
        }
        await tokenService.storeRefreshToken(refreshToken, user._id);
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        const userDto = new UserDto(user);
        res.json({
            user: userDto,
            auth: true,
        });
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;
        tokenService.removeToken(refreshToken)
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json(
            {
                user: null,
                auth: false
            }
        )
    }
}

export default (new authController());