export class ResourceNotFoundError extends Error {
  constructor() {
    super("This resource was not found.");
  }
}
