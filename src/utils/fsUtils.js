const fs = require('fs').promises;
const path = require('path');

// 递归遍历目录，查找 扩展名 文件
const findFileByExtenionDown = async (directory, fileExtenionName)=>{
    try {
        const files = await fs.readdir(directory, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(directory, file.name);

            if (file.isDirectory()) {
                // 递归遍历子目录
                const result = await findFileByExtenionDown(fullPath, fileExtenionName);
                if (result) {
                    return result; // 如果找到 扩展名文件，则返回
                }
            } else if (file.isFile() && path.extname(file.name) === `.${fileExtenionName}`) {
                // 如果是  fileExtenion 扩展名文件，返回文件名
                return fullPath;
            }
        }
    } catch (err) {
        console.error(`Error while traversing directory: ${directory}`, err);
    }

    return null; // 如果未找到 扩展名文件，返回 null
}

// 递归遍历目录，查找 扩展名 文件
const findAllFileByExtenionDown = async (dirPath, fileExtenionName, callback)=>{
    fs.readdir(dirPath).then(dirContents=>{
        dirContents.forEach(dc=>{
            let fullPath = path.join(dirPath, dc);
            fs.stat(fullPath).then(stats => {
                if (stats.isDirectory()) {
                    findAllFileByExtenionDown(fullPath, fileExtenionName, callback);
                } else if (path.extname(fullPath) === `.${fileExtenionName}`) {
                    callback(fullPath);
                }
            });
        })
    });
}

// 递归遍历目录，查找 扩展名 文件
const findFileByExtenionUp = async (directory, fileExtenionName)=>{
    try {
        const files = await fs.readdir(directory);
        for (const file of files) {
            if (path.extname(file) === `.${fileExtenionName}`) {
                return path.join(directory, file);
            }
        }
    
        const parentDirectory = path.resolve(directory, '..');
        if (parentDirectory === directory) {
            // Reached the root directory
            return null;
        }
        return findFileByExtenionUp(parentDirectory, fileExtenionName);
    } catch (err) {
        console.error(`Error while traversing directory: ${directory}`, err);
    }

    return null; // 如果未找到 扩展名文件，返回 null
}

const isDirectory = async (directory) => {
    try {
        const stats = await fs.stat(directory);
        return stats.isDirectory();
    } catch (error) {
        console.error(`Error checking if path is directory: ${error}`);
        return false;
    }
}

module.exports={
    findFileByExtenionDown,
    findFileByExtenionUp,
    findAllFileByExtenionDown,
    isDirectory,
}