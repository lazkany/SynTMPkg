import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {In, Out, SyntmAstType } from './generated/ast.js';
import type { SyntmServices } from './syntm-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SyntmServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SyntmValidator;
    const checks: ValidationChecks<SyntmAstType> = {
        //Model: validator.checkModel,
        In: validator.checkInParam,
        Out: validator.checkOutParam,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SyntmValidator {

    // /**
    //  * 
    //  * @param model 
    //  * @param accept 
    //  */
    // checkModel(model: Model, accept: ValidationAcceptor): void {
    //     const agents =model.agents;
    //     const previousnames = new Set<string>();
    //     agents.forEach(agent => {
    //         if (previousnames.has(agent.name)) {
    //             accept('error', `Dupplicate agent name '${agent.name}'`, { node: agent, property: 'name' });
    //         }
    //         else{
    //             previousnames.add(agent.name);
    //         }
    //     });
     
    //     // if (person.name) {
    //     //     const firstChar = person.name.substring(0, 1);
    //     //     if (firstChar.toUpperCase() !== firstChar) {
    //     //         accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //     //     }
    //     // }
    // }
    /**
     * 
     * @param input 
     * @param accept 
     */
    checkInParam(input: In, accept: ValidationAcceptor): void {
        const inputs =input.ins;
        const previousnames = new Set<string>();
        inputs.forEach(inp => {
            if (previousnames.has(inp.name.toLowerCase())) {
                accept('error', `Duplicate input name '${inp.name}'`, { node: inp, property: 'name' });
            }
            else{
                previousnames.add(inp.name.toLowerCase());
            }
        });
    };
    /**
     * 
     * @param out 
     * @param accept 
     */
    checkOutParam(out: Out, accept: ValidationAcceptor): void {
        const outs =out.outs;
        const previousnames = new Set<string>();
        outs.forEach(ou => {
            if (previousnames.has(ou.name.toLowerCase())) {
                accept('error', `Duplicate output name '${ou.name}'`, { node: ou, property: 'name' });
            }
            else{
                previousnames.add(ou.name.toLowerCase());
            }
        });
    };

}
