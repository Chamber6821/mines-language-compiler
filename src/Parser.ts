import Lexer           from './Lexer';
import TokenProvider   from './TokenProvider';
import ExpressionNode  from './nodes/ExpressionNode';
import ConstantNode    from './nodes/ConstantNode';
import IntegerNode     from './nodes/IntegerNode';
import BinOperatorNode from './nodes/BinOperatorNode';
import ProcedureNode   from './nodes/ProcedureNode';
import CodeBlockNode   from './nodes/CodeBlockNode';


type OperandNode = ConstantNode | IntegerNode

export default class Parser {

    private provider: TokenProvider
    private tokenTypes: typeof Lexer.prototype.tokenTypes

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



        //TODO: Придумать ошибку для parseExpression
        throw new Error('Ты че бля написал, шалава?')
    }

    private parseConstantDeclaration(): BinOperatorNode {
        this.provider.require(this.tokenTypes.CONSTANT)
        const nameToken = this.provider.require(this.tokenTypes.NAME);
        const assignToken = this.provider.require(this.tokenTypes.ASSIGN)
        const expressionNode = this.parseMathExpression()
        this.provider.match(this.tokenTypes.SEMICOLON)

        return new BinOperatorNode(new ConstantNode(nameToken), assignToken, expressionNode)
    }

    private parseMathExpression(): OperandNode | BinOperatorNode {
        let node: ReturnType<typeof Parser.prototype.parseMathExpression> = this.parseOperand()
        let operator = this.provider.match(this.tokenTypes.MINUS, this.tokenTypes.PLUS)
        while (operator !== null) {
            const rightNode = this.parseOperand()
            node = new BinOperatorNode(node, operator, rightNode)
            operator = this.provider.match(this.tokenTypes.MINUS, this.tokenTypes.PLUS)
        }

        return node
    }

    private parseOperand(): OperandNode {
        const token = this.provider.require(this.tokenTypes.NAME, this.tokenTypes.INT)

        if (token.type.name === this.tokenTypes.INT.name) return new IntegerNode(token)
        return new ConstantNode(token)
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
