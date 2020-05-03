var mysql = require('mysql');

function get_query_res(base, token, callback) {
    console.log("--sql query--");
    console.log(token);
    console.log("Querying...");

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: base
    });

    connection.connect();

    connection.query(token, function(err, data) {
        if (err) {
            console.log(err);
            console.log("");
        }
        callback(data);
        connection.end();
    });
}

module.exports = {
    get_query_res
}
