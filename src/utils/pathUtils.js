const vscode = require('vscode');
const getSystemAbsolutePath = (uri)=>{
    return uri.toString().startsWith('file:///')
    ? uri.toString().replace('file:///', '').replace("%3A", ":")
    : uri.toString();
}

const getSystemRelativePath = (uri)=>{
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (workspaceFolder) {
        return vscode.workspace.asRelativePath(uri, false);
    } else {
        throw new Error("workspaceFolder 不存在");
    }
}

module.exports = {
    getSystemAbsolutePath,
    getSystemRelativePath,
}