module.exports = class HttpError extends Error {
    /**
     * 
     * @param {number} code 
     * @param {string} message 
     * @param {Error} prevError 
     */
    constructor(code, message, prevError) {
        super(message);
        this.code = code;
        this.prevError = prevError;
    }
    
    /**
     * Previous error message.
     * @returns {string}
     */
    get previousErrorMessage() {
        const prevError = this.prevError || {message: undefined};
        return prevError.message;
    }
}