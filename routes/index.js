var auth = require("./auth.js"),
	form = require("./formData.js"),
	tutorial = require("./tutorial.js");
	files = require("./readFileNames.js")

exports.getJournal = tutorial.getJournal;
exports.getPageById = tutorial.getPageById;
exports.getViews = tutorial.getViews;
exports.findPageByTagName = tutorial.findPageByTagName;
exports.searchAllPages = tutorial.searchAllPages;
exports.savePage = tutorial.savePage;
exports.getImageForm = tutorial.getImageForm;
exports.getPostImageData = tutorial.getPostImageData;

exports.getData = form.getData;
exports.getDataById = form.getDataById;
exports.uploadFile = form.uploadFile;
exports.InsertData = form.InsertData;
exports.ReplaceData = form.ReplaceData;
exports.deleteData = form.deleteData;

exports.changePass = auth.changePass;

exports.showFiles = files.showFiles;