import CompileError from './CompileError';


export default class ParserError extends CompileError {

    constructor(message: string, pos: { line: number, symbol: number }) {
        super(message, pos)
        this.name = 'ParserError'

        Object.setPrototypeOf(this, ParserError.prototype)
    }
}
