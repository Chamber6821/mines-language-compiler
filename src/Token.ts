import TokenType from './TokenType';


export default class Token {
    type: TokenType
    text: string
    pos: { line: number, symbol: number }

    constructor(type: TokenType, text: string, pos: { line: number; symbol: number }) {
        this.type = type;
        this.text = text;
        this.pos = pos;
    }
}
