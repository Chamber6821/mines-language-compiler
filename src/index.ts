import Lexer  from './lexer/Lexer';
import Parser from './parser/Parser';
import util   from 'util'

const code = `
void loop {
    const A = 5
    const B = (A + 10) * (6 + 5)
}
`;

// const compiler = new Compiler(
//     new Parser(
//         new Lexer(code)
//     )
// )

const lexer = new Lexer(code);
const parser = new Parser(lexer)


try {
    const rootNode = parser.buildTree()
    console.log(util.inspect(rootNode, {
        colors: true,
        depth:  100
    }))
} catch (e) {
    console.log(e)//.toString())
    process.exit(1)
}

process.exit(0)
