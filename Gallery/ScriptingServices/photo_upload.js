var uploadLib = require("upload");
if(request.getMethod()=="POST"){
    var files = uploadLib.consumeFiles(request);
    for(var i = 0 ; i < files.length; i++){
        var file = files[i];
        fileStorage.put(file.name, file.data, file.contentType);
    }
}

// put(path, data, contentType) - add file at given path
// get(path) - retrieves file by given path
// delete(path) - removes file by given path
// clear() - removes all files from the storage