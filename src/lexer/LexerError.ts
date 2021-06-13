import BaseError from '../BaseError';


export default class LexerError extends BaseError {

    constructor(message: string, pos: { line: number, symbol: number }) {
        super(message, pos)
        this.name = 'LexerError'

        Object.setPrototypeOf(this, LexerError.prototype)
    }
}
