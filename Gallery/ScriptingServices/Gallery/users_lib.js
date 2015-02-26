var systemLib = require('system');
var ioLib = require('io');
var entityLib = require('entity');

// create entity by parsing JSON object from request body
exports.createTable_users = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO TABLE_USERS (";
        sql += "USER_ID";
        sql += ",";
        sql += "USER_NAME";
        sql += ",";
        sql += "USER_PASSWORD";
        sql += ",";
        sql += "USER_EMAIL";
        sql += ",";
        sql += "USER_LOGIN";
        sql += ") VALUES ("; 
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ",";
        sql += "?";
        sql += ")";

        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = db.getNext('TABLE_USERS_USER_ID');
        statement.setInt(++i, id);
        statement.setString(++i, message.user_name);
        statement.setString(++i, message.user_password);
        statement.setString(++i, message.user_email);
        statement.setString(++i, message.user_login);
        statement.executeUpdate();
        response.getWriter().println(id);
        return id;
    } catch(e) {
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    return -1;
};

// read single entity by id and print as JSON object to response
exports.readTable_usersEntity = function(id) {
    var connection = datasource.getConnection();
    try {
        var result = "";
        var sql = "SELECT * FROM TABLE_USERS WHERE " + pkToSQL();
        var statement = connection.prepareStatement(sql);
        statement.setString(1, id);
        
        var resultSet = statement.executeQuery();
        var value;
        while (resultSet.next()) {
            result = createEntity(resultSet);
        }
        if(result.length === 0){
            entityLib.printError(javax.servlet.http.HttpServletResponse.SC_NOT_FOUND, 1, "Record with id: " + id + " does not exist.");
        }
        var text = JSON.stringify(result, null, 2);
        response.getWriter().println(text);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// read all entities and print them as JSON array to response
exports.readTable_usersList = function(limit, offset, sort, desc) {
    var connection = datasource.getConnection();
    try {
        var result = [];
        var sql = "SELECT ";
        if (limit !== null && offset !== null) {
            sql += " " + db.createTopAndStart(limit, offset);
        }
        sql += " * FROM TABLE_USERS";
        if (sort !== null) {
            sql += " ORDER BY " + sort;
        }
        if (sort !== null && desc !== null) {
            sql += " DESC ";
        }
        if (limit !== null && offset !== null) {
            sql += " " + db.createLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        var value;
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
        var text = JSON.stringify(result, null, 2);
        response.getWriter().println(text);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

//create entity as JSON object from ResultSet current Row
function createEntity(resultSet, data) {
    var result = {};
	result.user_id = resultSet.getInt("USER_ID");
    result.user_name = resultSet.getString("USER_NAME");
    result.user_password = resultSet.getString("USER_PASSWORD");
    result.user_email = resultSet.getString("USER_EMAIL");
    result.user_login = resultSet.getString("USER_LOGIN");
    return result;
};

// update entity by id
exports.updateTable_users = function() {
    var input = ioLib.read(request.getReader());
    var message = JSON.parse(input);
    var connection = datasource.getConnection();
    try {
        var sql = "UPDATE TABLE_USERS SET ";
        sql += "USER_NAME = ?";
        sql += ",";
        sql += "USER_PASSWORD = ?";
        sql += ",";
        sql += "USER_EMAIL = ?";
        sql += ",";
        sql += "USER_LOGIN = ?";
        sql += " WHERE USER_ID = ?";
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, message.user_name);
        statement.setString(++i, message.user_password);
        statement.setString(++i, message.user_email);
        statement.setString(++i, message.user_login);
        var id = "";
        id = message.user_id;
        statement.setInt(++i, id);
        statement.executeUpdate();
        response.getWriter().println(id);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

// delete entity
exports.deleteTable_users = function(id) {
    var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM TABLE_USERS WHERE "+pkToSQL();
        var statement = connection.prepareStatement(sql);
        statement.setString(1, id);
        var resultSet = statement.executeUpdate();
        response.getWriter().println(id);
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
};

exports.countTable_users = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
        var statement = connection.createStatement();
        var rs = statement.executeQuery('SELECT COUNT(*) FROM TABLE_USERS');
        while (rs.next()) {
            count = rs.getInt(1);
        }
    } catch(e){
        var errorCode = javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
        entityLib.printError(errorCode, errorCode, e.message);
    } finally {
        connection.close();
    }
    response.getWriter().println(count);
};

exports.metadataTable_users = function() {
	var entityMetadata = {};
	entityMetadata.name = 'table_users';
	entityMetadata.type = 'object';
	entityMetadata.properties = [];
	
	var propertyuser_id = {};
	propertyuser_id.name = 'user_id';
	propertyuser_id.type = 'integer';
	propertyuser_id.key = 'true';
	propertyuser_id.required = 'true';
    entityMetadata.properties.push(propertyuser_id);

	var propertyuser_name = {};
	propertyuser_name.name = 'user_name';
    propertyuser_name.type = 'string';
    entityMetadata.properties.push(propertyuser_name);

	var propertyuser_password = {};
	propertyuser_password.name = 'user_password';
    propertyuser_password.type = 'string';
    entityMetadata.properties.push(propertyuser_password);

	var propertyuser_email = {};
	propertyuser_email.name = 'user_email';
    propertyuser_email.type = 'string';
    entityMetadata.properties.push(propertyuser_email);

	var propertyuser_login = {};
	propertyuser_login.name = 'user_login';
    propertyuser_login.type = 'string';
    entityMetadata.properties.push(propertyuser_login);


    response.getWriter().println(JSON.stringify(entityMetadata));
};

function getPrimaryKeys(){
    var result = [];
    var i = 0;
    result[i++] = 'USER_ID';
    if (result === 0) {
        throw new Exception("There is no primary key");
    } else if(result.length > 1) {
        throw new Exception("More than one Primary Key is not supported.");
    }
    return result;
}

function getPrimaryKey(){
	return getPrimaryKeys()[0].toLowerCase();
}

function pkToSQL(){
    var pks = getPrimaryKeys();
    return pks[0] + " = ?";
}

exports.processTable_users = function() {
	
	// get method type
	var method = request.getMethod();
	method = method.toUpperCase();
	
	//get primary keys (one primary key is supported!)
	var idParameter = getPrimaryKey();
	
	// retrieve the id as parameter if exist 
	var id = xss.escapeSql(request.getParameter(idParameter));
	var count = xss.escapeSql(request.getParameter('count'));
	var metadata = xss.escapeSql(request.getParameter('metadata'));
	var sort = xss.escapeSql(request.getParameter('sort'));
	var limit = xss.escapeSql(request.getParameter('limit'));
	var offset = xss.escapeSql(request.getParameter('offset'));
	var desc = xss.escapeSql(request.getParameter('desc'));
	
	if (limit === null) {
		limit = 100;
	}
	if (offset === null) {
		offset = 0;
	}
	
	if(!entityLib.hasConflictingParameters(id, count, metadata)) {
		// switch based on method type
		if ((method === 'POST')) {
			// create
			exports.createTable_users();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				exports.readTable_usersEntity(id);
			} else if (count !== null) {
				exports.countTable_users();
			} else if (metadata !== null) {
				exports.metadataTable_users();
			} else {
				exports.readTable_usersList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			exports.updateTable_users();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				exports.deleteTable_users(id);
			}
		} else {
			entityLib.printError(javax.servlet.http.HttpServletResponse.SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	response.getWriter().flush();
	response.getWriter().close();
};
