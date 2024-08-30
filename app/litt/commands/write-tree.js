const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

// function writeBlob(currentPath) {
//     const fileContent = fs.readFileSync(currentPath);
//     const fileLength = fileContent.length;

//     const header = `blob ${fileLength}\0`;
//     const blob = Buffer.concat([Buffer.from(header), fileContent]);

//     const hash = crypto.createHash("sha1").update(blob).digest("hex");

//     const folder = hash.slice(0, 2);
//     const file = hash.slice(2);

//     const folderPath = path.join(process.cwd(), ".git", "objects", folder);

//     if(!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//     }

//     const compressed = zlib.deflateSync(blob);
//     fs.writeFileSync(path.join(folderPath, file), compressed);

//     return hash;
// }

class CommandWriteTree {
    execute() {
        const recursiveTreeTraversal = (dir) => {
            let tree = '';
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    const hash = recursiveTreeTraversal(filePath);
                    tree += `40000 ${file}\0${Buffer.from(hash, 'hex')}`;
                } else {
                    const fileContent = fs.readFileSync(filePath);
                    const hash = crypto.createHash('sha1').update(`blob ${fileContent.length}\0${fileContent}`).digest('hex');
                    tree += `100644 ${file}\0${Buffer.from(hash, 'hex')}`;
                }
            });

            const treeBuffer = Buffer.from(`tree ${tree.length}\0${tree}`);
            const treeHash = crypto.createHash('sha1').update(treeBuffer).digest('hex');
            const folder = treeHash.slice(0, 2);
            const file = treeHash.slice(2);

            const treeFolderPath = path.join(process.cwd(), ".git", "objects", folder);

            if (!fs.existsSync(treeFolderPath)) {
                fs.mkdirSync(treeFolderPath);
            }

            const compressed = zlib.deflateSync(treeBuffer);
            fs.writeFileSync(path.join(treeFolderPath, file), compressed);

            return treeHash;
        };

        const sha = recursiveTreeTraversal(process.cwd());
        if (sha) {
            process.stdout.write(sha);
        } else {
            console.error("Error: SHA value is null or undefined.");
            process.exit(1);
        }
    }
}

module.exports = CommandWriteTree;

// recursively traverse the working directory
// if the object is a directory again traverse it recursively
// if the object is a file then create blob object, write hash and content to the object