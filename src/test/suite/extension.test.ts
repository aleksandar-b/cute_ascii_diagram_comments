import * as assert from 'assert';
import * as vscode from 'vscode';
import * as asciiDocComments from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(2,3);
	});
});
