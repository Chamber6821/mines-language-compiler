import ExpressionNode from './ExpressionNode';
import Token          from '../lexer/Token';


export default class IntegerNode extends ExpressionNode {
    number: Token

    constructor(number: Token) {
        super();
        this.number = number;
    }
}
