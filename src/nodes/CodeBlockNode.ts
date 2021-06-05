import ExpressionNode from './ExpressionNode';


export default class CodeBlockNode extends ExpressionNode {
    expressions: ExpressionNode[]

    constructor(expressions?: ExpressionNode[]) {
        super();
        this.expressions = expressions || [];
    }

    addExpression(node: ExpressionNode) {
        this.expressions.push(node)
    }
}
