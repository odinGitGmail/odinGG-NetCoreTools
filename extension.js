const path = require('path');
const vscode = require('vscode');
const dotnetUtils = require('./src/utils/dotnetToolUtils')
const dotnetPrjFile = require('./src/dotnetNewPrjFileSelect')
const pathUtils = require('./src/utils/pathUtils')
const fsUtils = require('./src/utils/fsUtils')
const fs = require('fs')
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	// buildCsproj
	context.subscriptions.push(vscode.commands.registerCommand('extension.buildCsproj', (uri) => {
		dotnetUtils.dotNetTool(uri, "build");
	}));

	// runCsproj
	context.subscriptions.push(vscode.commands.registerCommand('extension.runCsproj', (uri) => {
		dotnetUtils.dotNetTool(uri, "run");
	}));

	// cleanCsproj
	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanCsproj', (uri) => {
		dotnetUtils.dotNetTool(uri, "clean");
	}));

	// buildSolution
	context.subscriptions.push(vscode.commands.registerCommand('extension.buildSolution', (uri) => {
		dotnetUtils.dotNetTool(uri, "build");
	}));

	// runSolution
	context.subscriptions.push(vscode.commands.registerCommand('extension.runSolution', (uri) => {
		dotnetUtils.dotNetTool(uri, "run");
	}));

	// cleanSolution
	context.subscriptions.push(vscode.commands.registerCommand('extension.cleanSolution', (uri) => {
		dotnetUtils.dotNetTool(uri, "clean");
	}));

	// dotnetNewFile
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
		});
		
	}));

	// addCsprojInSln
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

	// dotnetNewSln
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
	
	// dotnetNewPrj
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

	// dotnetNewPrjAddInSln
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
						let dirPath = '';
						if(relativePath.endsWith('.sln')){
							dirPath = prjNameValue;
						}
						else{
							dirPath = rootPath;
						}
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
												dirPath, 
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

	// reconfiguration - rename namespace
	context.subscriptions.push(vscode.commands.registerCommand('extension.renamespace', (uri) => {
		const baseUri = pathUtils.getSystemRelativePath(uri);
		let newNamespace = '';
		const regex = /namespace [A-Za-z][A-Za-z0-9.]*/g; // 正则表达式，用于匹配 namespace
		// 如果后缀是cs文件
		if(uri.fsPath.endsWith(".cs")){
			if(baseUri.indexOf('/')>-1){
				newNamespace = baseUri.substring(0,baseUri.lastIndexOf('/')).replaceAll('/','.');
			}
			else{
				newNamespace = uri._fsPath.substring(0,uri._fsPath.lastIndexOf('/'));
				newNamespace = newNamespace.substring(newNamespace.lastIndexOf('/')+1);
			}
			if(baseUri.indexOf('\\')>-1){
				newNamespace = uri._fsPath.substring(0,uri._fsPath.lastIndexOf('\\'));
				newNamespace = newNamespace.substring(newNamespace.lastIndexOf('\\')+1);
			}
			let fileContent = fs.readFileSync(uri.fsPath,{ 'encoding':'utf-8' });
			fileContent = fileContent.replace(regex, `namespace ${newNamespace}`);
			fs.writeFileSync(uri.fsPath, fileContent, "utf-8");
		}
		else{
			if(uri._fsPath === baseUri){
				// 如果当前文件是根目录下的cs文件
				fsUtils.findAllFileByExtenionDown(uri.fsPath,'cs',async fspath=>{
					if(fspath.replace(uri.fsPath+'/','').indexOf('/')===-1 && fspath.replace(uri.fsPath+'\\','').indexOf('\\')===-1){
						if(uri.fsPath.indexOf('/')>-1){
							newNamespace = uri.fsPath.substring(uri.fsPath.lastIndexOf('/')+1);
						}
						if(uri.fsPath.indexOf('\\')>-1){
							newNamespace = uri.fsPath.substring(uri.fsPath.lastIndexOf('\\')+1);
						}
					}
					else{
						if(baseUri.indexOf('/')>-1){
							const fsRelativePath = fspath.replace(baseUri+'/','').substring(0,fspath.replace(baseUri,'').lastIndexOf('/')-1);
							newNamespace = fsRelativePath;
							newNamespace = newNamespace.replaceAll('/','.');
						}
						if(baseUri.indexOf('\\')>-1){
							const fsRelativePath = fspath.replace(baseUri+'\\','').substring(0,fspath.replace(baseUri,'').lastIndexOf('\\')-1);
							newNamespace = fsRelativePath;
							newNamespace = newNamespace.replaceAll('\\','.');
						}
					}
					let fileContent = fs.readFileSync(fspath,{ 'encoding':'utf-8' });
					fileContent = fileContent.replace(regex, `namespace ${newNamespace}`);
					await fs.writeFileSync(fspath, fileContent, "utf-8");
				});
			}
			else{
				fsUtils.findAllFileByExtenionDown(uri.fsPath,'cs',async fspath=>{
					if(baseUri.indexOf('/')>-1){
						newNamespace = baseUri.replaceAll('/','.');
					}
					if(baseUri.indexOf('\\')>-1){
						newNamespace = baseUri.replaceAll('\\','.');
					}
					let fileContent = fs.readFileSync(fspath,{ 'encoding':'utf-8' });
					fileContent = fileContent.replace(regex, `namespace ${newNamespace}`);
					await fs.writeFileSync(fspath, fileContent, "utf-8");
				});
			}
		}
	}));

	// testCommand
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
