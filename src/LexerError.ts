import CompileError from './CompileError';


export default class LexerError extends CompileError {

    constructor(message: string, pos: { line: number, symbol: number }) {
        super(message, pos)
        this.name = 'LexerError'

        Object.setPrototypeOf(this, LexerError.prototype)
    }
}
