class ResponseModel<T> {
  constructor(
    public success: boolean,
    public data: T,
    public timestamp: Date,
    public message: string,
  ) {}
}

export default ResponseModel;