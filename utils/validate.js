import { validationResult } from "express-validator";
import { ApiErrorClass } from "./apiErrorClass.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    let error = '';
    errors.array().forEach((err) => {
        error += `${err.msg} `;
    } );
    throw new ApiErrorClass(422, error)
}
