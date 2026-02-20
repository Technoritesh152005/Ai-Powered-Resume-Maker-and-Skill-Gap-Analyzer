import apiErrorInstance from "../../utils/apiError"
import logger from "../../utils/logs"
// it is an express based error handler
const errorHandler = (err, req, res, next) => {

    const error = err;


    // means it is a non apistyle error
    if (!(error instanceof Error)) {
        statusCode = error.statusCode || 500
        errorMesaage = error.message || 'Internal server erro'
        // isOperational = false 
        error = new apiErrorInstance(statusCode, errorMessage, false, error.stack)
    }

    // if that error was not apiInstance u converted it
    // now prepare a response and log this and pass it to user
    const response = {
        success: false,
        error: error.messaage,
        statusCode: error.statusCode,
    }

    // logging the error in system
    logger.error(`Error : ${error.messaage}`, {
        path: req.path,
        statusCode: error.statusCode,
        ip: req.ip,
        user: req.user?._id || {},
        method: req.method
    })

    res.status(error.statusCode).json(response)

}

const handler404 = (req, res, next) => {

    // we take this error and pass to error handler it will take all care. to pass to error handler we need to just do next(error)
    const error = new apiErrorInstance(error.statusCode, error.messaage, `error Path : ${req.originalUrl}`)
    next(error)

}

// mongodb error are of type like given below
const handleMongodbError = (err, req, res, next) => {

    console.log(err)
    if (err.name.toLowerCase() === 'validationerror') {
        const errors = Object.values(err.errors).map((e) => e.messaage)
        const message = `validationerror : ${errors.join(', ')}`
        return next(new apiErrorInstance(400, message
        ))
    }

    // object.keys and object.values always return in array
    if (err.code = 11000) {
        // if duplicate we need to find what duplicate do we get
        const field = Object.keys(err.keyPattern)[0]
        const message = `Duplicate key found for ${field}`
        // here we are creating instance of apierror and not passing to apierror. it is going to express midlleware
        return next(new apiErrorInstance(400, message))
    }
    // Mongo expected one type, but you gave wrong type.
    if (err.name === 'CastError') {

        const message = `Invalid ${err.path} for : ${err.value}`
        return next(new apiErrorInstance(400, message))
    }

    // if any of them doesnt fall to mongodb eeror pass to next
    next(err)
}

const handleJwtError = (err, req, res, next) => {

    if (err.name === 'JsonWebTokenError') {
        return next(new apiErrorInstance(400, 'Please login again'))
    }

    if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired. Please login again.'));
    }

    next(err);

}

export { handleJwtError, handleMongodbError, handler404, errorHandler }
// error for validation looks like this
// {
//     name: "ValidationError",
//     message: "User validation failed: email: Path `email` is required.",
//     errors: {
//       email: {
//         name: "ValidatorError",
//         message: "Path `email` is required.",
//         kind: "required",
//         path: "email",
//         value: undefined
//       }
//     },
//     _message: "User validation failed",
//     stack: "full stack trace..."
//   }

// mongodb duplicate key error
// {
//     name: "MongoServerError",
//     code: 11000,
// here email is key and 1 is value. so we take email by putting [0]
//     keyPattern: { email: 1 },
//     keyValue: { email: "ritesh@gmail.com" },
//     message: "E11000 duplicate key error collection: users index: email_1 dup key: { email: \"ritesh@gmail.com\" }",
//     stack: "stack trace..."
//   }

// {
//     name: "CastError",
//     message: "Cast to ObjectId failed for value \"abc123\" at path \"_id\"",
//     kind: "ObjectId",
//     path: "_id",
//     value: "abc123",
//     stack: "full stack trace..."
//   }
// cast error means simply u required this kind but u provided this value from the path field is which caused problem



// we get   email: {
//         name: "ValidatorError",
//         message: "Path `email` is required.",
//         kind: "required",
//         path: "email",
//         value: undefined
//       }


// How Express Error Flow Works

// When you do:

// next(error);

// Express skips all normal middleware
// and directly looks for:

// (err, req, res, next)

// functions.

// That’s why we must define it like:
// next(error);

// Express changes behavior.

// Instead of going to the next normal middleware…

// It skips ALL normal middleware
// and searches for the next middleware that has:

// (err, req, res, next)

// i.e. error-handling middleware