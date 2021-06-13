export default class BaseError extends Error {

    readonly pos = { line: 0, symbol: 0 }

    constructor(message: string, pos?: { line: number, symbol: number }) {
        super(message)
        this.name = 'BaseError'
        pos && (this.pos = pos)

        Object.setPrototypeOf(this, BaseError.prototype)
    }

    toString(): string {
        return `${this.name}:${this.pos.line}:${this.pos.symbol}: ${this.message}`
    }
}
