import ExpressionNode from './ExpressionNode';
import Token          from '../Token';


export default class BinOperatorNode extends ExpressionNode {
    operator: Token
    left: ExpressionNode
    right: ExpressionNode

    constructor(left: ExpressionNode, operator: Token, right: ExpressionNode) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}