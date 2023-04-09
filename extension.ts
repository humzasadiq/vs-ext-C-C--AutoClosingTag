import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register a command that adds semicolons to C/C++ code

  let disposable = vscode.commands.registerCommand('extension.addSemicolons', () => {

    // Get the active text editor
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      let document = editor.document;
      let text = document.getText();

      // Split the text into lines and add semicolons to the end of each non-empty line
      let lines = text.split(/\r?\n/);
      let newText = "";
      let inFunction = false;
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmedLine = line.trim();
        let leadingWhitespace = line.substr(0, line.indexOf(trimmedLine));

        if (trimmedLine.length === 0 || trimmedLine.startsWith("#include")) {
          newText += line;
        } else if (trimmedLine.startsWith("int main(") || trimmedLine.startsWith("void ")) {
          newText += trimmedLine;

        } else if (inFunction || trimmedLine.endsWith(";") || trimmedLine.endsWith("}")) {
          newText += line;
        } else {
          newText += leadingWhitespace + trimmedLine + ";";
        }

        if (i !== lines.length - 1) {
          newText += "\n";
        }
      }

      // Replace the text in the editor with the new text
      let start = new vscode.Position(0, 0);
      let end = new vscode.Position(document.lineCount, 0);
      let range = new vscode.Range(start, end);
      editor.edit((editBuilder) => {
        editBuilder.replace(range, newText);
      });
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }
