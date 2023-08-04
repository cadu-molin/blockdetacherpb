const vscode = require('vscode');

function activate(context) {
    console.log('A extensão "Collapse Code Blocks" está ativa.');

    let disposable = vscode.commands.registerCommand('extension.collapseBlock', () => {
        collapseBlock();
    });

    context.subscriptions.push(disposable);

    // Registre o comando para expandir o bloco de código
    disposable = vscode.commands.registerCommand('extension.expandBlock', () => {
        expandBlock();
    });

    context.subscriptions.push(disposable);

    // Inscreva-se para ouvir os eventos de pressionar tecla
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(handleSelectionChange));
}

function handleSelectionChange(event) {
    // Verifique se a seleção está vazia
    if (!event.selections || event.selections.length === 0) {
        return;
    }

    // Obter o editor de texto ativo
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // Obter a posição do cursor atual
    const cursorPos = event.selections[0].active;

    // Obter o texto da linha onde o cursor está posicionado
    const lineText = editor.document.lineAt(cursorPos).text;

    // Verifique se a linha contém a palavra "function"
    if (lineText.includes('function')) {
        collapseBlock();
    }
}

function collapseBlock() {
    // Obter o editor de texto ativo
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // Obter a posição do cursor atual
    const cursorPos = editor.selection.active;

    // Obter o número da linha onde o cursor está posicionado
    const line = cursorPos.line;

    // Obter o início e o final do bloco de código
    let startLine = line;
    let endLine = line;
    while (startLine > 0 && !editor.document.lineAt(startLine).text.includes('{')) {
        startLine--;
    }
    while (endLine < editor.document.lineCount && !editor.document.lineAt(endLine).text.includes('}')) {
        endLine++;
    }

    // Verifique se encontrou as chaves de abertura e fechamento
    if (startLine >= 0 && endLine < editor.document.lineCount && startLine < endLine) {
        // Ocultar as linhas do bloco de código, exceto a primeira
        const range = new vscode.Range(startLine + 1, 0, endLine, 0);
        editor.edit(editBuilder => {
            editBuilder.replace(range, '');
        });
    }
}

function expandBlock() {
    // Obter o editor de texto ativo
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // Obter a posição do cursor atual
    const cursorPos = editor.selection.active;

    // Obter o número da linha onde o cursor está posicionado
    const line = cursorPos.line;

    // Obter o início e o final do bloco de código
    let startLine = line;
    let endLine = line;
    while (startLine > 0 && !editor.document.lineAt(startLine).text.includes('forward prototypes')) {
        startLine--;
    }
    while (endLine < editor.document.lineCount && !editor.document.lineAt(endLine).text.includes('end prototypes')) {
        endLine++;
    }

    // Verifique se encontrou as chaves de abertura e fechamento
    if (startLine >= 0 && endLine < editor.document.lineCount && startLine < endLine) {
        // Obter o texto completo do bloco de código
        let blockText = '';
        for (let i = startLine + 1; i < endLine; i++) {
            blockText += editor.document.lineAt(i).text + '\n';
        }

        // Inserir o texto de volta no editor
        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(startLine + 1, 0), blockText);
        });
    }
}

function deactivate() {
    // Nada a fazer aqui
}

module.exports = {
    activate,
    deactivate
};
