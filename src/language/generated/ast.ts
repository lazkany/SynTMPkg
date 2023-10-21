/******************************************************************************
 * This file was generated by langium-cli 2.0.1.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const SyntmTerminals = {
    WS: /\s+/,
    ID: /[_a-zA-Z][\w_]*/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};

export type Simple = Exp | Phi;

export const Simple = 'Simple';

export function isSimple(item: unknown): item is Simple {
    return reflection.isInstance(item, Simple);
}

export interface Agent extends AstNode {
    readonly $container: Model;
    readonly $type: 'Agent';
    ains: In
    aouts: Out
    name: string
}

export const Agent = 'Agent';

export function isAgent(item: unknown): item is Agent {
    return reflection.isInstance(item, Agent);
}

export interface Assumption extends AstNode {
    readonly $container: Model;
    readonly $type: 'Assumption';
    formula: Array<Phi>
    name: string
}

export const Assumption = 'Assumption';

export function isAssumption(item: unknown): item is Assumption {
    return reflection.isInstance(item, Assumption);
}

export interface Exp extends AstNode {
    readonly $type: 'BOP' | 'Exp' | 'Phi' | 'UOP' | 'UPhi';
    name: 'false' | 'true' | string
}

export const Exp = 'Exp';

export function isExp(item: unknown): item is Exp {
    return reflection.isInstance(item, Exp);
}

export interface Guarantee extends AstNode {
    readonly $container: Model;
    readonly $type: 'Guarantee';
    formula: Array<Phi>
    name: string
}

export const Guarantee = 'Guarantee';

export function isGuarantee(item: unknown): item is Guarantee {
    return reflection.isInstance(item, Guarantee);
}

export interface In extends AstNode {
    readonly $container: Agent | Int;
    readonly $type: 'In';
    ins: Array<Param>
}

export const In = 'In';

export function isIn(item: unknown): item is In {
    return reflection.isInstance(item, In);
}

export interface Int extends AstNode {
    readonly $container: Model;
    readonly $type: 'Int';
    sins: In
    souts: Out
}

export const Int = 'Int';

export function isInt(item: unknown): item is Int {
    return reflection.isInstance(item, Int);
}

export interface Model extends AstNode {
    readonly $type: 'Model';
    agents: Array<Agent>
    Assumptions?: Assumption
    Guarantees?: Guarantee
    interfc?: Int
    name: Module
}

export const Model = 'Model';

export function isModel(item: unknown): item is Model {
    return reflection.isInstance(item, Model);
}

export interface Module extends AstNode {
    readonly $container: Model;
    readonly $type: 'Module';
    name: string
}

export const Module = 'Module';

export function isModule(item: unknown): item is Module {
    return reflection.isInstance(item, Module);
}

export interface Out extends AstNode {
    readonly $container: Agent | Int;
    readonly $type: 'Out';
    outs: Array<Param>
}

export const Out = 'Out';

export function isOut(item: unknown): item is Out {
    return reflection.isInstance(item, Out);
}

export interface Param extends AstNode {
    readonly $container: In | Out;
    readonly $type: 'Param';
    name: string
}

export const Param = 'Param';

export function isParam(item: unknown): item is Param {
    return reflection.isInstance(item, Param);
}

export interface Phi extends Exp {
    readonly $type: 'BOP' | 'Phi';
    fexp: Simple
    left?: Exp
    right?: Exp
}

export const Phi = 'Phi';

export function isPhi(item: unknown): item is Phi {
    return reflection.isInstance(item, Phi);
}

export interface UPhi extends Exp {
    readonly $type: 'UOP' | 'UPhi';
    op: Exp
}

export const UPhi = 'UPhi';

export function isUPhi(item: unknown): item is UPhi {
    return reflection.isInstance(item, UPhi);
}

export interface BOP extends Phi {
    readonly $type: 'BOP';
    name: '&' | '->' | '<->' | 'R' | 'U' | '|'
}

export const BOP = 'BOP';

export function isBOP(item: unknown): item is BOP {
    return reflection.isInstance(item, BOP);
}

export interface UOP extends UPhi {
    readonly $type: 'UOP';
    name: '!' | 'F' | 'G' | 'X'
}

export const UOP = 'UOP';

export function isUOP(item: unknown): item is UOP {
    return reflection.isInstance(item, UOP);
}

export type SyntmAstType = {
    Agent: Agent
    Assumption: Assumption
    BOP: BOP
    Exp: Exp
    Guarantee: Guarantee
    In: In
    Int: Int
    Model: Model
    Module: Module
    Out: Out
    Param: Param
    Phi: Phi
    Simple: Simple
    UOP: UOP
    UPhi: UPhi
}

export class SyntmAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['Agent', 'Assumption', 'BOP', 'Exp', 'Guarantee', 'In', 'Int', 'Model', 'Module', 'Out', 'Param', 'Phi', 'Simple', 'UOP', 'UPhi'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case BOP: {
                return this.isSubtype(Phi, supertype);
            }
            case Exp: {
                return this.isSubtype(Simple, supertype);
            }
            case Phi: {
                return this.isSubtype(Exp, supertype) || this.isSubtype(Simple, supertype);
            }
            case UOP: {
                return this.isSubtype(UPhi, supertype);
            }
            case UPhi: {
                return this.isSubtype(Exp, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'Assumption': {
                return {
                    name: 'Assumption',
                    mandatory: [
                        { name: 'formula', type: 'array' }
                    ]
                };
            }
            case 'Guarantee': {
                return {
                    name: 'Guarantee',
                    mandatory: [
                        { name: 'formula', type: 'array' }
                    ]
                };
            }
            case 'In': {
                return {
                    name: 'In',
                    mandatory: [
                        { name: 'ins', type: 'array' }
                    ]
                };
            }
            case 'Model': {
                return {
                    name: 'Model',
                    mandatory: [
                        { name: 'agents', type: 'array' }
                    ]
                };
            }
            case 'Out': {
                return {
                    name: 'Out',
                    mandatory: [
                        { name: 'outs', type: 'array' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new SyntmAstReflection();
