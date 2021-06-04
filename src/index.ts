import Lexer      from './Lexer';
import LexerError from './LexerError';


const code = `
void loop {
    const A = 5
    const B = A + 10
}
`;

// const compiler = new Compiler(
//     new Parser(
//         new Lexer(code)
//     )
// )

const lexer = new Lexer(code);

try {
    for (let token of lexer.getTokens()) {
        const text = JSON.stringify(token.text).slice(1, -1)
        console.log(`${token.type.name}:${token.pos.line}:${token.pos.symbol} '${text}'`)
    }
} catch (e) {
    if (e instanceof LexerError) {
        console.log(`${e.name}:${e.pos.line}:${e.pos.symbol}: ${e.message}`)
    } else {
        console.log(e)
    }
    process.exit(1)
}

process.exit(0)
