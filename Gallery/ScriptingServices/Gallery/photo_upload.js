var uploadLib = require("upload");
if(request.getMethod()=="POST"){
    var files = uploadLib.consumeFiles(request);
    var storedFiles = [];
    for(var i = 0 ; i < files.length; i++){
        var file = files[i];
        fileStorage.put(file.name, file.data, file.contentType);
        storedFiles.push({"fileName": file.name});
    }
    response.setContentType("text/json");
    response.getWriter().println(JSON.stringify(storedFiles));
}
