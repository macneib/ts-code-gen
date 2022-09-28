import { Project, VariableDeclarationKind, ObjectLiteralExpression, SyntaxKind, CallExpression} from "ts-morph";

let functionName: string = 'example'
let activityName: string = 'greet';
let parameterName: string = 'name';

const project = new Project();

const sourceFile = project.createSourceFile("../target/src/workflow.ts", writer => {
  writer
    .writeLine("import { proxyActivities } from '@temporalio/workflow';")
    .writeLine("import type * as activities from './activities';").blankLine()
}, { overwrite: true } );



const variable = sourceFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  declarations: [{ name: `{${activityName}}`, initializer: "proxyActivities<typeof activities>({startToCloseTimeout: '1 minute',})" }]
});


const functionDeclaration = sourceFile.addFunction({
  name: functionName,
});

functionDeclaration.setIsAsync(true);
functionDeclaration.setIsExported(true);

functionDeclaration.insertParameter(0, {
  name: parameterName,
  type: "string"
});

functionDeclaration.setReturnType(writer => {
  writer.writeLine("Promise<string>")
})

functionDeclaration.setBodyText(`return await ${activityName}(${parameterName});`);

sourceFile.formatText();
sourceFile.save();
