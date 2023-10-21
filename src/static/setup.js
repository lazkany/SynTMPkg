import { MonacoEditorLanguageClientWrapper } from './monaco-editor-wrapper/index.js';
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
import monarchSyntax from "./syntaxes/syntm.monarch.js";
import { vscode } from './monaco-editor-wrapper/index.js';


buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');

const client = new MonacoEditorLanguageClientWrapper();
const editorConfig = client.getEditorConfig();
editorConfig.setMainLanguageId('syntm');

editorConfig.setMonarchTokensProvider(monarchSyntax);

editorConfig.setMainCode(`

SPEC FullArbiter

In(r0,r1,r2) , Out(g0,g1,g2)

Agent A1 -> In(r0) , Out(g0)
Agent A2 -> In(r1) , Out(g1)
Agent A3 -> In(r2) , Out(g2)

Assume Env /*comments*/
true

Guarantee Sys
G ((g0 & G !r0) -> (F!g0))
G ((g1 & G !r1) -> (F !g1))
G ((g2 & G !r2) -> (F !g2))
G ((g0 & X (!r0 & !g0)) -> X (r0 R !g0))
G ((g1 & X (!r1 & !g1)) -> X (r1 R !g1))
G ((g2 & X (!r2 & !g2)) -> X (r2 R !g2))
G ((!g0 & !g1) | ((!g0 | !g1) & !g2))
r0 R !g0
r1 R !g1
r2 R !g2
G (r0 -> F g0)
G (r1 -> F g1)
G (r2 -> F g2)
`);

editorConfig.theme = 'vs';
editorConfig.useLanguageClient = true;
editorConfig.useWebSocket = false;

const workerURL = new URL('./syntm-server-worker.js', import.meta.url);
console.log(workerURL.href);

const lsWorker = new Worker(workerURL.href, {
    type: 'classic',
    name: 'Syntm Language Server'
});
client.setWorker(lsWorker);

// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
const startingPromise = client.startEditor(document.getElementById("monaco-editor-root"));

const generateAndDisplay = (async () => {
    console.info('generating & running current code...');
    const value = client.getEditor()?.getValue();
    // parse & generate commands for drawing an image
    // execute custom LSP command, and receive the response
    const syntmCmds = await vscode.commands.executeCommand('parseAndGenerate', value);
    updateSyntmCanvas(syntmCmds);
});

// Updates the mini-logo canvas
window.generateAndDisplay = generateAndDisplay;

// Takes generated MiniLogo commands, and draws on an HTML5 canvas
function updateSyntmCanvas(cmds) {
    // print the commands out, so we can verify what we have received.
    // TODO, will change in th next section...
    alert(cmds);
}
