import Lexer       from '../lexer/Lexer';
import TokenType   from '../lexer/TokenType';
import Token       from '../lexer/Token';
import ParserError from './ParserError';


export default class TokenProvider {

    private lexer: Lexer
    private tokenChain: Generator<Token>
    private lastToken: Token | null = null
    private lastValidToken: Token

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.tokenChain = lexer.getTokenChain()
        this.lastToken = this.extractToken()
        this.lastValidToken = this.lastToken || new Token(this.lexer.tokenTypes.NEW_LINE, ' ', { line: 0, symbol: 0 })
    }

    empty(): boolean {
        return this.lastToken === null
    }

    willMatched(...expected: TokenType[]): boolean {
        if (this.lastToken === null) return expected.length === 0

        const token: Token = this.lastToken
        return expected.some((type) => type.name === token.type.name)
    }

    match(...expected: TokenType[]): Token | null {

        const newLine = this.lexer.tokenTypes.NEW_LINE

        if (expected.some((type) => type.name === newLine.name)) {
            return this.primaryMatch(...expected)
        }

        let token = this.primaryMatch(...expected, newLine)
        while (token && token.type.name === newLine.name) {
            token = this.primaryMatch(...expected, newLine)
        }

        return token
    }

    require(...expected: TokenType[]): Token {
        const token = this.match(...expected)

        if (token !== null) return token

        const met = this.lastToken ? `'${this.lastToken.text}'` : 'end of input'
        const message = `Expected tokens ${expected.map((type) => type.name).join(' or ')} but met ${met}`
        throw new ParserError(message, this.lastValidToken.pos)
    }

    skip(...types: TokenType[]) {
        while (this.match(...types)) {
        }
    }

    private primaryMatch(...expected: TokenType[]): Token | null {
        if (this.lastToken === null) return null

        const token: Token = this.lastToken
        if (expected.length === 0 || expected.some((type) => type.name === token.type.name)) {
            this.lastToken = this.extractToken()
            this.lastValidToken = this.lastToken || this.lastValidToken
            return token
        }

        return null
    }

    private extractToken(): Token | null {
        const yieldExpression = this.tokenChain.next()
        if (yieldExpression.done) return null
        return yieldExpression.value
    }
}
