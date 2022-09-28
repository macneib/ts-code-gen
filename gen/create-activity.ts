import {Project} from "ts-morph";

let activityName: string = 'greet';

const project = new Project();

const sourceFile = project.createSourceFile("../target/src/activities.ts", (writer) => {}, {
  overwrite: true,
});

const functionDeclaration = sourceFile.addFunction({
  name: activityName,
});

functionDeclaration.setIsAsync(true);
functionDeclaration.setIsExported(true);

functionDeclaration.insertParameter(0, {
    name: "name",
    type: "string"
});

functionDeclaration.setReturnType(writer => {
    writer.writeLine("Promise<string>")
})

functionDeclaration.setBodyText("return `Hello, ${name}!`;");
sourceFile.formatText();
sourceFile.save();
