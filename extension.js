const path = require('path');
const vscode = require('vscode');
const dotnetUtils = require('./src/utils/dotnetToolUtils')
const dotnetPrjFile = require('./src/dotnetNewPrjFileSelect')
const pathUtils = require('./src/utils/pathUtils')
const fsUtils = require('./src/utils/fsUtils')
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.buildCsproj', (uri) => {
		dotnetUtils.dotNetTool(uri, "build");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.runCsproj', (uri) => {
		dotnetUtils.dotNetTool(uri, "run");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanCsproj', (uri) => {
		dotnetUtils.dotNetTool(uri, "clean");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.buildSolution', (uri) => {
		dotnetUtils.dotNetTool(uri, "build");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.runSolution', (uri) => {
		dotnetUtils.dotNetTool(uri, "run");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanSolution', (uri) => {
		dotnetUtils.dotNetTool(uri, "clean");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.dotnetNewFile', (uri) => {
		const pickSelect = dotnetPrjFile.dotnetNewFileSelect();
		vscode.window.showQuickPick(pickSelect).then((fileTypeValue)=>{
			const selectPath = uri.fsPath;
			fsUtils.isDirectory(selectPath)
				.then(result=>{
					let dirPath = '';
					if(result){
						dirPath = selectPath;
					}
					else{
						const filePath = uri.fsPath;
						dirPath = path.dirname(filePath);
					}
					if(fileTypeValue.startsWith("other")){
						vscode.window.showInputBox({
							password:false,
							placeHolder: '请输入文件模板短名称'
						})
						.then(fileTypeOtherValue=>{
							const fileType = fileTypeOtherValue;
							dotnetUtils.dotNetTool(
								fileType, 
								'addFileInFolder', 
								dirPath
							);
						});
					}
					else{
						const fileType = dotnetPrjFile.getDotnetFileType(fileTypeValue);
						dotnetUtils.dotNetTool(
							fileType, 
							'addFileInFolder', 
							dirPath
						);
					}
					
				});
			// if(fileTypeValue.startsWith("other")){
			// 	vscode.window.showInputBox({
			// 		password:false,
			// 		placeHolder: '请输入项目模板短名称'
			// 	})
			// 	.then(fileTypeOtherValue=>{
			// 		const fileType = fileTypeOtherValue;
			// 		dotnetUtils.dotNetTool(
			// 			fileType, 
			// 			'addFileInFolder-Other', 
			// 			fileDirectory
			// 		);
			// 	});
			// }
			// else{
			// 	const fileType = dotnetPrjFile.getDotnetFileType(fileTypeValue);
			// 	dotnetUtils.dotNetTool(
			// 		fileType, 
			// 		'addFileInFolder', 
			// 		fileDirectory
			// 	);
			// }
			// dotnetUtils.dotNetTool(csprjFilePath, "addFileInFolder", fileDirectory);
		});
		
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.addCsprojInSln', (uri) => {
		const csprjFilePath = uri.fsPath;
		const fileDirectory = path.dirname(csprjFilePath);
		fsUtils.findFileByExtenionUp(fileDirectory,'sln')
			.then(slnFullPath=>{
				if(slnFullPath!==null){
					dotnetUtils.dotNetTool(csprjFilePath, "addPrjInSln", slnFullPath);
				}
			});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.dotnetNewSln', (uri) => {
		vscode.window.showInputBox({
			password:false,
			placeHolder:"Solution 名称"
		}).then((value)=>{
			let slnName = value;
			if(slnName!=='' && slnName!==undefined){
				dotnetUtils.dotNetTool(uri, "newsln", `${slnName}`);
			}
		})
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.dotnetNewPrj', (uri) => {
		const pickSelect = dotnetPrjFile.dotnetNewPrjSelect();
		vscode.window.showQuickPick(pickSelect).then((prjTypeValue)=>{
			if(prjTypeValue.startsWith("other")){
				vscode.window.showInputBox({
					password:false,
					placeHolder: '请输入项目模板短名称'
				})
				.then(prjTypeOtherValue=>{
					vscode.window.showInputBox({
						password:false,
						placeHolder:'请输入项目名称',
					}).then(prjNameValue=>{
						const prjType = prjTypeOtherValue;
						dotnetUtils.dotNetTool(
							pathUtils.getSystemRelativePath(uri), 
							`${prjType}-OtherNewPrj`, 
							`${prjNameValue}`
						);
					});
				});
			}
			else{
				vscode.window.showInputBox({
					password:false,
					placeHolder:'请输入项目名称',
				}).then(prjNameValue=>{
					const prjType = dotnetPrjFile.getDotnetPrjType(prjTypeValue);
					dotnetUtils.dotNetTool(
						pathUtils.getSystemRelativePath(uri), 
						`${prjType}-NewPrj`, 
						`${prjNameValue}`
					);
				});
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.dotnetNewPrjAddInSln', (uri) => {
		const pickSelect = dotnetPrjFile.dotnetNewPrjSelect();
		vscode.window.showQuickPick(pickSelect).then((prjTypeValue)=>{
			if(prjTypeValue.startsWith("other")){
				vscode.window.showInputBox({
					password:false,
					placeHolder: '请输入项目模板短名称'
				})
				.then(prjTypeOtherValue=>{
					let dirName = '';
					const uriPath = pathUtils.getSystemAbsolutePath(uri);
					if(uriPath.indexOf('/')>-1){
						dirName = uriPath.split('/')[uriPath.split('/').length-2];
					}
					else{
						dirName = uriPath.split('\\')[uriPath.split('\\').length-2];
					}
					vscode.window.showInputBox({
						password:false,
						placeHolder:'请输入项目名称',
						value: dirName
					}).then(prjNameValue=>{
						if(prjNameValue!=='' && prjNameValue!==undefined){
							const prjType = prjTypeOtherValue;
							let relativePath = pathUtils.getSystemRelativePath(uri);
							const absolutePath = pathUtils.getSystemAbsolutePath(uri);
							const rootPath = absolutePath.replace(relativePath,"");
							const slnPath = path.join(rootPath);
							fsUtils.findFileByExtenionDown(slnPath,'sln')
								.then(slnFileFullPath=>{
									if (slnFileFullPath) {
										vscode.window.showInputBox({
											password:false,
											placeHolder:'请输入Solution文件完整路径',
											value: slnFileFullPath
										}).then(slnFileFullPath=>{
											if(slnFileFullPath && slnFileFullPath.endsWith('.sln')){
												if(absolutePath.endsWith('.sln')){
													relativePath = path.join(rootPath, prjNameValue);
												}
												dotnetUtils.dotNetTool(
													relativePath, 
													`${prjType}-OtherAddInSln`, 
													`${prjNameValue}`
												);
											}
										});
									} else {
										vscode.window.showInputBox({
											password:false,
											placeHolder:'请输入Solution文件完整路径',
										}).then(slnFileFullPath=>{
											if(slnFileFullPath && slnFileFullPath.endsWith('.sln')){
												console.log(slnFileFullPath);
											}
										});
									}
								});
						}
					});
				});
			}
			else{
				let dirName = '';
				const uriPath = pathUtils.getSystemAbsolutePath(uri);
				if(uriPath.indexOf('/')>-1){
					dirName = uriPath.split('/')[uriPath.split('/').length-1];
				}
				else{
					dirName = uriPath.split('\\')[uriPath.split('\\').length-1];
				}
				vscode.window.showInputBox({
					password:false,
					placeHolder:'请输入项目名称',
					value: dirName
				}).then(prjNameValue=>{
					if(prjNameValue!=='' && prjNameValue!==undefined){
						const prjType = dotnetPrjFile.getDotnetPrjType(prjTypeValue);
						let relativePath = pathUtils.getSystemRelativePath(uri);
						const absolutePath = pathUtils.getSystemAbsolutePath(uri);
						const rootPath = absolutePath.replace(relativePath,"");
						const slnPath = path.join(rootPath);
						fsUtils.findFileByExtenionDown(slnPath,'sln')
							.then(slnFileFullPath=>{
								if (slnFileFullPath) {
									vscode.window.showInputBox({
										password:false,
										placeHolder:'请输入Solution文件完整路径',
										value: slnFileFullPath
									}).then(slnFileFullPath=>{
										if(slnFileFullPath && slnFileFullPath.endsWith('.sln')){
											if(absolutePath.endsWith('.sln')){
												relativePath = path.join(rootPath, prjNameValue);
											}
											dotnetUtils.dotNetTool(
												relativePath, 
												`${prjType}-AddInSln`, 
												`${prjNameValue}`
											);
										}
									});
								} else {
									vscode.window.showInputBox({
										password:false,
										placeHolder:'请输入Solution文件完整路径',
									}).then(slnFileFullPath=>{
										if(slnFileFullPath && slnFileFullPath.endsWith('.sln')){
											console.log(slnFileFullPath);
										}
									});
								}
							});
					}
				});
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.removeCsproj', (uri) => {
		const slnPath = pathUtils.getSystemRelativePath(uri);
		dotnetUtils.dotNetTool(
			slnPath, 
			`removePrj`
		);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.testCommand', (uri) => {
		console.log(typeof(uri));
		if (uri) {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

            if (workspaceFolder) {
                const relativePath = vscode.workspace.asRelativePath(uri, false);
				console.log(`Relative path: ${relativePath}`);
            } else {
                vscode.window.showInformationMessage('File is not in a workspace folder.');
            }
        } else {
            vscode.window.showInformationMessage('No file selected.');
        }
	}));
}

// This method is called when your extension is deactivated
function deactivate() { }



module.exports = {
	activate,
	deactivate
}
