const cp = require('child_process');
const vscode = require('vscode');
const prjSelect = require('./src/dotnetNewPrjSelect')
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
let outputChannel = vscode.window.createOutputChannel(`Dotnet Tools`);
let dotnetRunTerminal = vscode.window.createTerminal(`Dotnet Run`);
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.buildCsproj', (uri) => {
		dotNetTools(uri, "build");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.runCsproj', (uri) => {
		dotNetTools(uri, "run");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanCsproj', (uri) => {
		dotNetTools(uri, "clean");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.buildSolution', (uri) => {
		dotNetTools(uri, "build");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.runSolution', (uri) => {
		dotNetTools(uri, "run");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanSolution', (uri) => {
		dotNetTools(uri, "clean");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.dotnetNewSln', (uri) => {
		vscode.window.showInputBox({
			password:false,
			placeHolder:"sln名称"
		}).then((value)=>{
			let slnName = value;
			if(slnName!==''){
				dotNetTools(uri, "newsln", `${slnName}`);
			}
		})
		// 
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.dotnetNewPrj', (uri) => {
		const pickSelect = prjSelect.dotnetNewPrjSelect();
		vscode.window.showQuickPick(pickSelect).then(()=>{

		});
		// vscode.window.showInputBox({
		// 	password:false,
		// 	placeHolder:"sln名称"
		// }).then((value)=>{
		// 	let slnName = value;
		// 	if(slnName!==''){
		// 		dotNetTools(uri, "newsln", `${slnName}`);
		// 	}
		// })
		// 
	}));
}

// This method is called when your extension is deactivated
function deactivate() { }

function dotNetTools(commandPath, command, args) {
	let projectPath = commandPath.fsPath;
	switch(command){
		case "newsln":
			dotnetRunTerminal.show();
			// 向终端发送命令
			dotnetRunTerminal.sendText(`dotnet new sln --name ${args}`);
			break;
		case "run":
			dotnetRunTerminal.show();
			// 向终端发送命令
			dotnetRunTerminal.sendText(`dotnet run ${projectPath}`);
			break;
		default:
			outputChannel.clear();
			outputChannel.show(true);
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
					vscode.window.showErrorMessage(`${projectPath}`);
					vscode.window.showErrorMessage(`dotnet ${command} failed with code ${code}`);
				}
			});

			buildProcess.on('error', (err) => {
				console.error(`Failed to start subprocess: ${err}`);
			});
			break;
	}
}

module.exports = {
	activate,
	deactivate
}
