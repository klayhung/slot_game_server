const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazedctgb5213',
    database: 'slot_game',
});

connection.connect();

connection.query('select * from user where user_name = "curry"', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
});

const addUserToSql = 'INSERT INTO user(user_name, user_point) VALUES(?,?)';
const addUserToSqlParam = ['momo', 60000];

// connection.query(addUserToSql, addUserToSqlParam, (error, result) => {
//     if (error) {
//         console.log('[INSERT ERROR] - ', error.message);
//         return;
//     }
//     console.log('INSERT :', result);
// });

connection.query('select * from user', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
});

const modUserToSql = 'UPDATE user SET user_point = ? WHERE user_name = ?';
const modUserToSqlParams = [500, 'curry'];

connection.query(modUserToSql, modUserToSqlParams, (error, result) => {
    if (error) {
        console.log('[UPDATE ERROR] - ', error.message);
        return;
    }
    console.log('UPDATE :', result);
});

connection.query('select * from user', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
});

const delUserToSql = 'DELETE FROM user where user_id=5';

connection.query(delUserToSql, (error, result) => {
    if (error) {
        console.log('[DELETE ERROR] - ', error.message);
        return;
    }
    console.log('DELETE :', result);
});

connection.query('select * from user', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
});
