import Token          from '../lexer/Token';
import ExpressionNode from './ExpressionNode';


export default class ConstantNode extends ExpressionNode {
    name: Token

    constructor(name: Token) {
        super()
        this.name = name;
    }
}
