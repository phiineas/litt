const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

function writeBlob(currentPath) {
    const fileContent = fs.readFileSync(currentPath);
    const fileLength = fileContent.length;

    const header = `blob ${fileLength}\0`;
    const blob = Buffer.concat([Buffer.from(header), fileContent]);

    const hash = crypto.createHash("sha1").update(blob).digest("hex");

    const folder = hash.slice(0, 2);
    const file = hash.slice(2);

    const folderPath = path.join(process.cwd(), ".git", "objects", folder);

    if(!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const compressedData = zlib.deflateSync(blob);
    fs.writeFileSync(path.join(folderPath, file), compressedData);

    return hash;
}

class CommandWriteTree {
    constructor() {
        
    }

    execute() {
        function recursiveTreeTraversal(basePath) {
            const dirContents = fs.readdirSync(basePath).sort(); // Ensure lexicographical order
        
            const result = [];
        
            for (const dirContent of dirContents) {
                if (dirContent === ".git") {
                    continue;
                }
        
                const currentPath = path.join(basePath, dirContent);
                const stat = fs.statSync(currentPath);
        
                if (stat.isDirectory()) {
                    const sha = recursiveTreeTraversal(currentPath);
        
                    if (sha) {
                        result.push({
                            mode: "040000",
                            basename: dirContent,
                            sha,
                        });
                    }
                } else if (stat.isFile()) {
                    const sha = writeBlob(currentPath);
                    result.push({
                        mode: "100644",
                        basename: dirContent,
                        sha,
                    });
                }
            }
        
            if (result.length === 0) {
                return null;
            }
        
            const treeData = result.reduce((acc, curr) => {
                const { mode, basename, sha } = curr;
                return Buffer.concat([
                    acc,
                    Buffer.from(`${mode} ${basename}\0`),
                    Buffer.from(sha, "hex"),
                ]);
            }, Buffer.alloc(0));
        
            const tree = Buffer.concat([
                Buffer.from(`tree ${treeData.length}\0`),
                treeData,
            ]);
        
            const hash = crypto.createHash("sha1").update(tree).digest("hex");
        
            const folder = hash.slice(0, 2);
            const file = hash.slice(2);
        
            const treeFolderPath = path.join(process.cwd(), ".git", "objects", folder);
        
            if (!fs.existsSync(treeFolderPath)) {
                fs.mkdirSync(treeFolderPath);
            }
        
            const compressed = zlib.deflateSync(tree);
            fs.writeFileSync(path.join(treeFolderPath, file), compressed);
        
            return hash;
        }        

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