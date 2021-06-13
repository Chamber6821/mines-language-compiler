import BaseError from '../BaseError';


export default class ParserError extends BaseError {

    constructor(message: string, pos: { line: number, symbol: number }) {
        super(message, pos)
        this.name = 'ParserError'

        Object.setPrototypeOf(this, ParserError.prototype)
    }
}
