import Lexer           from './Lexer';
import TokenProvider   from './TokenProvider';
import ExpressionNode  from './nodes/ExpressionNode';
import ConstantNode    from './nodes/ConstantNode';
import IntegerNode     from './nodes/IntegerNode';
import BinOperatorNode from './nodes/BinOperatorNode';
import ProcedureNode   from './nodes/ProcedureNode';
import CodeBlockNode   from './nodes/CodeBlockNode';
import ParenthesesNode from './nodes/ParenthesesNode';
import TokenType       from './TokenType';


type TokenTypes = typeof Lexer.prototype.tokenTypes

const binOperators = ['PLUS', 'MINUS', 'MULTIPLE', 'DIVIDE', 'MOD'] as const
type BinOperators = typeof binOperators[number]
const operatorPriority: { [name in BinOperators]: number } = {
    PLUS:     1,
    MINUS:    1,
    MULTIPLE: 2,
    DIVIDE:   2,
    MOD:      3,
}

function isMostPriority(what: TokenType, then: TokenType): boolean {
    return operatorPriority[what.name as BinOperators] > operatorPriority[then.name as BinOperators]
}


export default class Parser {

    private provider: TokenProvider
    private readonly tokenTypes: TokenTypes

    constructor(lexer: Lexer) {
        this.provider = new TokenProvider(lexer)
        this.tokenTypes = lexer.tokenTypes
    }

    buildTree(): CodeBlockNode {
        const root = new CodeBlockNode()

        this.provider.skip(this.tokenTypes.SEMICOLON)
        while (!this.provider.empty()) {
            root.addExpression(this.parseExpression())
            this.provider.skip(this.tokenTypes.SEMICOLON)
        }

        return root
    }

    private parseExpression(): ExpressionNode {
        if (this.provider.willMatched(this.tokenTypes.CONSTANT)) {
            return this.parseConstantDeclaration()
        }

        if (this.provider.willMatched(this.tokenTypes.PROCEDURE)) {
            return this.parseProcedure()
        }

        if (this.provider.willMatched(this.tokenTypes.LBRACE)) {
            return this.parseCodeBlock()
        }

        //TODO: Придумать ошибку для parseExpression
        throw new Error('Ты че бля написал, шалава?')
    }

    private parseConstantDeclaration(): BinOperatorNode {
        this.provider.require(this.tokenTypes.CONSTANT)
        const nameToken = this.provider.require(this.tokenTypes.NAME);
        const assignToken = this.provider.require(this.tokenTypes.ASSIGN)
        const expressionNode = this.parseMathExpression()

        return new BinOperatorNode(new ConstantNode(nameToken), assignToken, expressionNode)
    }

    private parseMathExpression(): IntegerNode | ConstantNode | BinOperatorNode {
        // Главное, что работает
        //TODO: Отрефакторить Parser.parseMathExpression
        const binOperatorTypes = binOperators.map((name) => this.tokenTypes[name])

        let node: IntegerNode | ConstantNode | ParenthesesNode | BinOperatorNode = this.parseOperand()

        let operator = this.provider.match(...binOperatorTypes)
        while (operator !== null) {
            const rightNode = this.parseOperand()

            if (node instanceof BinOperatorNode && isMostPriority(operator.type, node.operator.type)) {
                const leftNode = node.right
                node.right = new BinOperatorNode(leftNode, operator, rightNode)
            } else {
                if (node instanceof ParenthesesNode) {
                    node = node.expression
                }
                node = new BinOperatorNode(node, operator, rightNode)
            }

            operator = this.provider.match(...binOperatorTypes)
        }

        return node as IntegerNode | ConstantNode | BinOperatorNode
    }

    private parseOperand(): IntegerNode | ConstantNode | ParenthesesNode {
        let token = this.provider.match(this.tokenTypes.NAME)
        if (token) return new ConstantNode(token)

        token = this.provider.match(this.tokenTypes.INT)
        if (token) return new IntegerNode(token)

        this.provider.require(this.tokenTypes.LPAR)
        const node = new ParenthesesNode(this.parseMathExpression())
        this.provider.require(this.tokenTypes.RPAR)

        return node
    }

    private parseProcedure(): ProcedureNode {
        this.provider.require(this.tokenTypes.PROCEDURE)
        const nameToken = this.provider.require(this.tokenTypes.NAME)
        const codeBlockNode = this.parseCodeBlock()

        return new ProcedureNode(nameToken, codeBlockNode)
    }

    private parseCodeBlock(): CodeBlockNode {
        const node = new CodeBlockNode()

        this.provider.require(this.tokenTypes.LBRACE)
        this.provider.skip(this.tokenTypes.SEMICOLON)
        while (!this.provider.willMatched(this.tokenTypes.RBRACE)) {
            node.addExpression(this.parseExpression())
            this.provider.skip(this.tokenTypes.SEMICOLON)
        }
        this.provider.require(this.tokenTypes.RBRACE)

        return node
    }
}
