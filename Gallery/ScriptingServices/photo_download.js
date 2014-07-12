if(request.getMethod()=="GET"){
    var fileName = xss.escapeSql(request.getParameter("fileName"));
    var file = fileStorage.get(fileName);
    
    if(file){
        response.setHeader("content-disposition", "inline");
        response.setHeader("content-disposition", "attachment; filename="+fileName);
        response.setContentType(file.contentType);         
        response.setContentLength(file.data.length);  
        io.write(file.data, response.getOutputStream());
    }else{
        response.getWriter().println("No file with name '" + fileName + "' found");
        response.setContentType("text/html");
    }
}
response.getWriter().flush();
response.getWriter().close();