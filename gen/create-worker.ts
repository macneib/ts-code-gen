import { Project, VariableDeclarationKind} from "ts-morph";

const project = new Project();

let taskQueueName: string = 'hello-world';

const sourceFile = project.createSourceFile("../target/src/worker.ts", writer => {
  writer
    .writeLine("import { Worker } from '@temporalio/worker';")
    .writeLine("import * as activities from './activities';").blankLine()
}, { overwrite: true } );

const functionDeclaration = sourceFile.addFunction({
  name: "run",
});

functionDeclaration.setIsAsync(true);

functionDeclaration.addVariableStatement({
  declarations: [{
    name: "worker",
    initializer: writer =>
      writer.writeLine("await Worker.create({")
      .writeLine("workflowsPath: require.resolve('./workflows'),")
      .writeLine("activities,")
      .writeLine(`taskQueue: '${taskQueueName}',})`)
  }],
    declarationKind: VariableDeclarationKind.Const,
})

functionDeclaration.addStatements("await worker.run();");

sourceFile.addStatements("run().catch((err) => {console.error(err);process.exit(1);});");

sourceFile.formatText();
sourceFile.save();
