export default class VisitorError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, this.constructor.name);
  }
}
