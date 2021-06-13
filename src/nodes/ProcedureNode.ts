import ExpressionNode from './ExpressionNode';
import Token          from '../lexer/Token';
import CodeBlockNode  from './CodeBlockNode';


export default class ProcedureNode extends ExpressionNode {
    name: Token
    body: CodeBlockNode

    constructor(name: Token, body: CodeBlockNode) {
        super();
        this.name = name;
        this.body = body
    }
}
