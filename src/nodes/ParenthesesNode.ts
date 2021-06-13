import ExpressionNode  from './ExpressionNode';
import IntegerNode     from './IntegerNode';
import ConstantNode    from './ConstantNode';
import BinOperatorNode from './BinOperatorNode';


export default class ParenthesesNode extends ExpressionNode {
    expression: IntegerNode | ConstantNode | BinOperatorNode

    constructor(expression: IntegerNode | ConstantNode | BinOperatorNode) {
        super();
        this.expression = expression;
    }
}
