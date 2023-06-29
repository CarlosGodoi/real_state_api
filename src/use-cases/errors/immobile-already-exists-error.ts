export class ImmobileAlreadyExistsError extends Error {
  constructor() {
    super('Immobile already exists.')
  }
}
