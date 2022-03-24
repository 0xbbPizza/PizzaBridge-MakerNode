const mysql = require('mysql2')

module.exports = {
  createTable: function () {
    const creatConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    })

    creatConnection.connect(function (error) {
      if (error) {
        console.log('err =', error)
        throw error
      }
    })

    creatConnection.query(
      'CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME,
      function (err) {
        if (err) {
          console.log('err =', err)
          throw err
        } else {
          console.log('datebase created')
        }
      },
    )
    creatConnection.end(function (err) {
      if (err) {
        console.log('close database error')
        throw err
      }
    })
  },
  query: function (sql, params) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      })
      connection.connect(function (err) {
        if (err) {
          console.log('err =', err.message)
          reject(err)
          return
        }
        let createMainTabels = `create table if not exists ${process.env.DB_TABLE_NAME}(
                          id int primary key auto_increment unique,
                          transactionID varchar(255) not null unique,
                          makerAddress varchar(50) not null default '0x',
                          userAddress varchar(60) not null default '0x',
                          fromChain varchar(10) not null default '0',
                          toChain varchar(10) not null default '0',
                          formTx varchar(255) not null default '0x',
                          toTx varchar(255) not null default '0x',
                          fromAmount varchar(40) not null default '0',
                          toAmount varchar(40) not null default '0',
                          fromTimeStamp varchar(40) not null default '0',
                          toTimeStamp varchar(40) not null default '0',
                          state int not null default 0
                      )`
        connection.query(createMainTabels, function (err) {
          if (err) {
            console.log('err =', err)
            reject(err)
            return
          } else {
          }
        })

        let createZkHashTabel = `create table if not exists ${process.env.DB_ZK_TABLE_NAME}(
                          id int primary key auto_increment unique,
                          makerAddress varchar(50) not null default '0',
                          validPText varchar(20) not null default '0',
                          tokenAddress varchar(70) not null default '0',
                          txhash varchar(255) not null default '0'
                      )`
        connection.query(createZkHashTabel, function (err) {
          if (err) {
            console.log('err =', err)
            reject(err)
            return
          } else {
          }
        })

        connection.query(sql, params, function (err, results, fields) {
          if (err) {
            // callback && callback(err)
            reject(err)
            return
          }
          resolve(results)
          // callback && callback(err, results, fields)
          connection.end(function (err) {
            if (err) {
              console.log('close database error！')
            }
          })
        })
      })
    })
  },
}
