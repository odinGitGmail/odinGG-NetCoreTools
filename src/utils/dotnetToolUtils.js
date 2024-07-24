const vscode = require('vscode');
const cp = require('child_process');
const path = require('path');
let outputChannel = vscode.window.createOutputChannel(`Dotnet Tools`);
let dotnetRunTerminal = vscode.window.createTerminal(`Dotnet Run`);
function dotNetTool(commandPath, command, args) {
	let projectPath = commandPath.fsPath;
    const dotnetCommand = command.endsWith("-AddInSln") || command.endsWith("-NewPrj") || command.endsWith("-OtherNewPrj") || command.endsWith("-OtherAddInSln")?"csprojSln":command;
	switch(dotnetCommand){
        case "addFileInFolder":
            dotnetRunTerminal.show();
            dotnetRunTerminal.sendText(`dotnet new ${commandPath} --output ${args}`);
            break;
        case "addPrjInSln":
            dotnetRunTerminal.show();
            dotnetRunTerminal.sendText(`dotnet sln ${args} add ${commandPath}`);
            break;
        case "removePrj":
            dotnetRunTerminal.show();
            dotnetRunTerminal.sendText(`dotnet sln remove ${commandPath}`);
            break;
        case "csprojSln":
            dotnetRunTerminal.show();
            const useCommand = command.endsWith("-AddInSln") || command.endsWith("-NewPrj") || command.endsWith("-OtherNewPrj") || command.endsWith("-OtherAddInSln")
                ?command.replace("-AddInSln","").replace("-NewPrj","").replace("-OtherNewPrj","").replace("-OtherAddInSln","")
                :command;
			// 向终端发送命令
			dotnetRunTerminal.sendText(`dotnet new ${useCommand} --name ${args} --output ${commandPath}`);
            if(command.indexOf("AddInSln")>-1){
                var addSlnPath = path.join(commandPath,`${args}.csproj`);
                dotnetRunTerminal.sendText(`dotnet sln add ${addSlnPath}`);
            }
            break;
        case "webapi":
        case "webapp":
        case "web":
        case "console":
        case "classlib":
            dotnetRunTerminal.show();
			// 向终端发送命令
			dotnetRunTerminal.sendText(`dotnet new ${command} --name ${args} --output ${commandPath}`);
            break;
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

module.exports={
    dotNetTool,
}