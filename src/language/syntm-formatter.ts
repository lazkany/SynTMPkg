import type { AstNode } from 'langium';
import { AbstractFormatter, Formatting } from 'langium';
import * as ast from './generated/ast.js';

export class SyntmFormatter extends AbstractFormatter {

    protected format(node: AstNode): void {
        if (ast.isModel(node)) {
            const formatter = this.getNodeFormatter(node);
            const nodes = formatter.nodes(...node.agents);
            nodes.prepend(Formatting.noIndent());
        }
        else if (ast.isAssumption(node) || ast.isGuarantee(node)) {
            const formatter = this.getNodeFormatter(node);
            const nodes = formatter.nodes(...node.formula);
            nodes.prepend(Formatting.noIndent());
        }
        else if (ast.isPhi(node)) {
            const formatter = this.getNodeFormatter(node);
            const bracesOpen = formatter.keyword('(');
            const bracesClose = formatter.keyword(')');
            formatter.interior(bracesOpen, bracesClose).prepend(Formatting.indent());
            bracesClose.prepend(Formatting.newLine());
        } 
    }

}