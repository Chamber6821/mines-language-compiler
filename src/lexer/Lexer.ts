import Token      from './Token';
import TokenType  from './TokenType';
import LexerError from './LexerError';


const tokenConf = {
    PROCEDURE: 'void',
    FUNCTION:  'func',
    CONSTANT:  'const',
    // RETURN:    'return',
    // IF:        'if',
    // WHILE:     'while',

    SEMICOLON: ';',
    NEW_LINE:  '\\n',
    SPACE:     '\\s',

    LBRACE: '{',
    RBRACE: '}',
    LPAR:   '\\(',
    RPAR:   '\\)',

    ASSIGN:   '=',
    PLUS:     '\\+',
    MINUS:    '\\-',
    MULTIPLE: '\\*',
    DIVIDE:   '/',
    MOD:      '%',

    INT:  '[0-9]+',
    NAME: '\\w+',
}

type TokenTypeName = keyof typeof tokenConf


export default class Lexer {

    public readonly tokenTypes: { [name in TokenTypeName]: TokenType }

    private code: string
    private readonly pos: { line: number, symbol: number }

    constructor(code: string) {
        this.code = code
        this.pos = { line: 1, symbol: 1 }

        this.tokenTypes = Object.entries(tokenConf)
            .reduce((acc, [name, regex]) => ({ ...acc, [name]: new TokenType(name, regex) }), {}) as any
    }

    * getTokenChain(): Generator<Token> {
        while (this.code.length > 0) {
            const token = this.matchToken(this.code)

            this.code = this.code.substring(token.text.length)

            if (token.type.name === this.tokenTypes.SPACE.name) continue

            if (token.type.name === this.tokenTypes.NEW_LINE.name) {
                this.pos.line++
                this.pos.symbol = 1
            } else {
                this.pos.symbol += token.text.length
            }

            yield token
        }
    }

    private matchToken(code: string): Token {
        let tokenType = undefined, match = null
        for (const name in this.tokenTypes) {
            tokenType = this.tokenTypes[name as TokenTypeName]
            const regex = new RegExp('^' + tokenType.regex)
            match = code.match(regex)
            if (match) break
        }

        if (tokenType === undefined || match === null) {
            throw new LexerError(`Unknown token`, this.pos)
        }

        return new Token(tokenType, match[0], { ...this.pos })
    }
}
