import * as mysql from 'mysql2';
import configure from "../../configure/configure";

const config = configure();

async function queryPromise(connection: mysql.Connection, sql: string, args?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, results, fields) => {
            if (err) {
                return reject(err);
            }
            resolve({ results, fields });
        });
    });
}

async function createConnection(): Promise<mysql.Connection> {
    const connection = mysql.createConnection({
        host: config.HOST || '127.0.0.1',
        port: config.DBPORT || 3306,// Default Mysql port // 3306
        user: config.DB_USER || 'user',
        password: config.DB_PASSWORD || 'password',
        database: config.DB_DATABASE || 'my_database',
        enableKeepAlive: true
    });

    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                reject(err);
            } else {
                keepAlive(connection);
                resolve(connection);
            }
        });
    });
}

function keepAlive(conn) {
    setInterval(function () {
        conn.query('SELECT 1', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }, 3600000);
}

async function closeConnection(connection: mysql.Connection): Promise<void> {
    return new Promise((resolve, reject) => {
        connection.end(err => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export {
    queryPromise,
    createConnection,
    keepAlive,
    closeConnection,
}
