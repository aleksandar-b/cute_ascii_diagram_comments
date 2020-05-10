// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
	getFunctionParams,
	getPositions,
	generateMarkers,
	getFunctionSignature,
	generateVerticalLines
  }  from './utils';
                              
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('asciidoccomments.docComments', () => {
		vscode.window.showInformationMessage('Hello World from asciidocComments!');
		
		if(!vscode.window.activeTextEditor) {
			return;
		}

		const selection:vscode.Selection  = vscode.window.activeTextEditor.selection;
		const startLine = selection.start.line - 1;
		const selectedText = vscode.window?.activeTextEditor?.document.getText(selection).replace(/\n/g, '');

		const parameters = getFunctionParams(selectedText);
		const functionSignature = getFunctionSignature(selectedText);
		const positions = getPositions(parameters, functionSignature);
		const markers = generateMarkers(positions.filter(({ isEmptyRow }) => !isEmptyRow), functionSignature);
		const verticalLines = generateVerticalLines(positions, functionSignature);

		const bucket:string[] = [];
		const all: string[] = bucket.concat(functionSignature, markers, verticalLines);
		
		const result = all.map((line: string) => line.startsWith('//') ? line : `//${line.slice(2)}`).join('\n');
		
		vscode.window.activeTextEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
			const pos = new vscode.Position(startLine, 0);
			editBuilder.insert(pos, result);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
