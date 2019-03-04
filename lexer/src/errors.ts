export class LexerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LexerError';
  }
}
