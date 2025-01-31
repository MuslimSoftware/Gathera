class StatusError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);

        // Set the prototype explicitly (required for extending built-in classes like Error)
        Object.setPrototypeOf(this, StatusError.prototype);

        // Set the error name
        this.name = this.constructor.name;

        // Set the custom status property
        this.status = status;
    }
}

export default StatusError;
