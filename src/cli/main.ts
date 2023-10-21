import chalk from 'chalk';
import { Command } from 'commander';
import { createSyntmServices } from '../language/syntm-module.js';
import {extractAstNode, extractDocument } from './cli-util.js';
import { NodeFileSystem } from 'langium/node';
import { generateJava } from '../generator/generator.js';
import { Model } from '../language/generated/ast.js';
import { extractDestinationAndName } from './cli-util.js';
import path from 'path';
import fs from 'fs';

export const parseAndValidate = async (fileName: string): Promise<void> => {
    // retrieve the services for our language
    const services = createSyntmServices(NodeFileSystem).Syntm;
    // extract a document for our program
    const document = await extractDocument(fileName, services);
    // extract the parse result details
    const parseResult = document.parseResult;
    // verify no lexer, parser, or general diagnostic errors show up
    if (parseResult.lexerErrors.length === 0 && 
        parseResult.parserErrors.length === 0
    ) {
        console.log(chalk.green(`Parsed and validated ${fileName} successfully!`));
        console.log(chalk.green(`Parsed and validated ${parseResult.value.$cstNode?.text} successfully!`));
    } else {
        console.log(chalk.red(`Failed to parse and validate ${fileName}!`));
    }
};

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createSyntmServices(NodeFileSystem).Syntm;
    const model = await extractAstNode<Model>(fileName, services);
    const cmds= generateJava(model);
    const data = extractDestinationAndName(fileName, opts.destination);
    

    const generatedFilePath = `${path.join(data.destination, model.name.name)}.java`;
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, cmds);
    // const data = extractDestinationAndName(fileName, opts.destination);
    

    // const generatedFilePath = `${path.join(data.destination, data.name)}.java`;
    // if (!fs.existsSync(data.destination)) {
    //     fs.mkdirSync(data.destination, { recursive: true });
    // }
    // fs.writeFileSync(generatedFilePath, cmds);
    console.log(chalk.green(`SynTM Compiled file is generated successfully: ${generatedFilePath}`));

};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
    .command('parseAndValidate')
    .argument('<file>', 'Source file to parse & validate (ending in ${fileExtensions})')
    .description('Indicates where a program parses & validates successfully, but produces no output code')
    .action(parseAndValidate);
    

    program
    .command('generate')
    .argument('<file>', 'Source file to parse & validate (ending in ${fileExtensions})')
    .option('-d, --destination <dir>', 'destination directory of generating')
    // new description
    .description('generates Java files')
    .action(generateAction);

    program.parse(process.argv);
}
