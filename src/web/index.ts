import { AstNode, LangiumServices } from "langium";
import { URI } from "vscode-uri";
import { EmptyFileSystem } from "langium";
import { createSyntmServices } from '../language/syntm-module.js';
import { Model } from "../language/generated/ast.js";
import { generateJava } from "../generator/generator.js";

/**
 * Extracts an AST node from a virtual document, represented as a string
 * @param content Content to create virtual document from
 * @param services For constructing & building a virtual document
 * @returns A promise for the parsed result of the document
 */
 async function extractAstNodeFromString<T extends AstNode>(content: string, services: LangiumServices): Promise<T> {
    // create a document from a string instead of a file
    const doc = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.parse('memory://syntm.document'));
    // proceed with build & validation
    await services.shared.workspace.DocumentBuilder.build([doc], { validation: true });
    // get the parse result (root of our AST)
    return doc.parseResult?.value as T;
}

/**
 * Parses a Syntm program & generates output as a list of Objects
 * @param SyntmProgram Syntm program to parse
 * @returns Generated output from this MiniLogo program
 */
export async function parseAndGenerate (SyntmProgram: string): Promise<string> {
    const services = createSyntmServices(EmptyFileSystem).Syntm;
    const model = await extractAstNodeFromString<Model>(SyntmProgram, services);
    // generate mini logo drawing commands from the model
    const cmds = generateJava(model);
    return Promise.resolve(cmds);
}