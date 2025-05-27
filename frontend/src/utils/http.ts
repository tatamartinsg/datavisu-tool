export const httpErrorReturn = (status: number, message: string, data?: undefined) => {
    return {
        status,
        message,
        data
    }
};