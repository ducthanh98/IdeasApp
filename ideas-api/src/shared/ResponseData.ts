export interface ResponseData<T> {
    statusCode: number;
    message: string;
    data: T | [] | any;
}
