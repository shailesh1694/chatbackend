const globalErrorhandle = async (error, req, res, next) => {
    res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error !"})
}

export default globalErrorhandle
