export default class CompileError extends Error {

    readonly pos = { line: 0, symbol: 0 }

    constructor(message: string, pos?: { line: number, symbol: number }) {
        super(message)
        this.name = 'CompileError'
        pos && (this.pos = pos)

        Object.setPrototypeOf(this, CompileError.prototype)
    }

    toString(): string {
        return `${this.name}:${this.pos.line}:${this.pos.symbol}: ${this.message}`
    }
}
