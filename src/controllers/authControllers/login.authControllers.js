import asyncHandler from "../../utils/asyncHandler"
import ApiError from "../../utils/apiError"
import userModel from "../../models/user.model"
import logger from "../../utils/logs"
import refreshTokenModel from "../../models/refreshToken"

export const login = asyncHandler(async(req,res,next)=>{

    // first check whether user exist
    // if not exist then hash and compare the password
    // if same generate refresh and access token , store the refresh token in db and return

    const {email,password} = req.body;
    const user = await userModel.find(email).select('+password')

    if(!user){
        throw new ApiError(40,'No Account found . Please Login')
    }
    if(!user.isActive){
        throw new ApiError(401,'Your account has been deactivated.Please contact "khilariritesh61@gmail.com" ')
    }
    const correctPassword = await userModel.comparePassword(password)

    if(!correctPassword){
        throw new ApiError(400,'Password is not same.Retry or forgot password')
    }

    const accessToken = userModel.generateAccessToken();
    const refreshToken = userModel.generateRefreshToken()

    if(!(accessToken && refreshToken)){
        throw new ApiError(500,'Access Token or refresh Token not generated')
    }

    const rtsaved = await refreshTokenModel.create({
        token:refreshToken,
        createdBy:req.ip,
        user:user._id,
        expiresAt:new Date(Date.now()+7 * 24 * 60 * 60 * 1000)

    })
    if(!rtsaved){
        throw new ApiError(401,'Faced difficulty to store Tokens in database')
    }

    // after sometime see diff bwn new Date and Date.now()
    userModel.lastLogin = new Date()
    await user.save({validateBeforeSave:false})

    const userresponse = user.toObject()
    delete userresponse.password

    logger.info(`User has been succesfully login of email ${user.email}`)

    res.status(200)
    .json(new ApiRespone(201, 
        'User has been successfully Login',
        {userresponse,refreshToken,accessToken}
    ))

    // never use next in controller and they r end of chainflow
})