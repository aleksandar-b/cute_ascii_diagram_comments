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

const languages = {
	typescript: '//',
	javascript: '//',
	vue: '//',
    javascriptreact: '//',
	typescriptreact: '//',
	golang: '//',
	python: '#',
	ruby: '#',
} as {[key: string]: string};
                                             
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('asciidoccomments.docComments', () => {	
		if(!vscode.window.activeTextEditor) {
			return;
		}

		const selection:vscode.Selection  = vscode.window.activeTextEditor.selection;
		const startLine = selection.start.line - 1;
		const selectedText = vscode.window?.activeTextEditor.document.getText(selection).replace(/\n/g, '').replace(/\s{2,}/g, '');

		const parameters = getFunctionParams(selectedText);
		const functionSignature = getFunctionSignature(selectedText);
		const positions = getPositions(parameters, functionSignature);
		const markers = generateMarkers(positions.filter(({ isEmptyRow }) => !isEmptyRow), functionSignature);
		const verticalLines = generateVerticalLines(positions, functionSignature);

		const bucket:string[] = [];
		const all: string[] = bucket.concat(functionSignature, markers, verticalLines);
		
		const result = all.map((line: string) => {
			var lang = vscode.window.activeTextEditor?.document.languageId || 'javascript';
			let comment = '//';
			if (languages.hasOwnProperty(lang)) {
				comment = languages[lang];
			}
			return `${comment} ${line}`;
		}).join('\n');
		
		vscode.window.activeTextEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
			const pos = new vscode.Position(startLine, 0);
			editBuilder.insert(pos, result);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
