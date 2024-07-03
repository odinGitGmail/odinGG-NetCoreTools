const cp = require('child_process');
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let outputChannel;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {




	context.subscriptions.push(vscode.commands.registerCommand('extension.buildCsproj', (uri) => {
		if (!outputChannel) {
			outputChannel = vscode.window.createOutputChannel('Dotnet Build');
		}
		dotNetClean(uri, "build", outputChannel);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.runCsproj', (uri) => {
		if (!outputChannel) {
			outputChannel = vscode.window.createOutputChannel('Dotnet run');
		}
		dotNetClean(uri, "run", outputChannel);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanCsproj', (uri) => {
		// Create output channel
		if (!outputChannel) {
			outputChannel = vscode.window.createOutputChannel('Dotnet Clean');
		}
		dotNetClean(uri, "clean", outputChannel);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.buildSolution', (uri) => {
		if (!outputChannel) {
			outputChannel = vscode.window.createOutputChannel('Dotnet Build');
		}
		dotNetClean(uri, "build", outputChannel);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.runSolution', (uri) => {
		if (!outputChannel) {
			outputChannel = vscode.window.createOutputChannel('Dotnet run');
		}
		dotNetClean(uri, "run", outputChannel);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanSolution', (uri) => {
		if (!outputChannel) {
			outputChannel = vscode.window.createOutputChannel('Dotnet Build');
		}
		dotNetClean(uri, "clean", outputChannel);
	}));
}

// This method is called when your extension is deactivated
function deactivate() { }

function dotNetClean(commandPath, command, outputChannel) {
	const projectPath = commandPath.fsPath;
	// Clear previous output and show the output channel
	outputChannel.clear();
	outputChannel.show(true);

	// Execute dotnet build command
	const buildProcess = cp.spawn('dotnet', [command, projectPath]);

	// Handle stdout data
	buildProcess.stdout.on('data', (data) => {
		outputChannel.append(data.toString());
	});

	// Handle stderr data
	buildProcess.stderr.on('data', (data) => {
		outputChannel.append(data.toString());
	})

	// Handle process exit
	buildProcess.on('close', (code) => {
		if (code === 0) {
			vscode.window.showInformationMessage(`dotnet ${command} succeeded`);
		} else {
			vscode.window.showErrorMessage(`dotnet ${command} failed with code ${code}`);
		}
	});
}

module.exports = {
	activate,
	deactivate
}
