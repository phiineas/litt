const CommandCatFile = require("./cat-file")
const CommandHashObject = require("./hash-object")
const CommandLsTree = require("./ls-tree")
const CommandWriteTree = require("./write-tree")
const CommandCommitTree = require("./commit-tree")

module.exports = {
    CommandCatFile,
    CommandHashObject,
    CommandLsTree,
    CommandWriteTree, 
    CommandCommitTree
}