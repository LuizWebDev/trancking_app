const db = require('../dbLink');

class User {
    constructor(data){
        this.user_id = data.user_id
        this.username = data.username
        this.password = data.password
        this.email = data.email
    }

    static get all(){
        return new Promise (async (resolve, reject) => {
            try {
                let userData = await db.query('SELECT * FROM users;')
                let users = userData.rows.map(u => new User(u))
                resolve (users)
            } catch (err) {
                reject('User not found')
            }
        })
    }

    static async create(userData) {
        return new Promise (async (resolve, reject) => {
            try {
                    let users = await db.query(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *;`, [userData.username, userData.password, userData.email])
                    let user = new User(users.rows[0])
                    resolve(user)

            } catch (err) {
                reject('User could not be created')
            }
        })
    }

    static async findByUsername(username) {
        return new Promise (async (resolve, reject) => {
            try {
                let userData = await db.query(`SELECT * FROM users WHERE username = $1;`, [username])
                let user = new User(userData.rows[0])
                resolve(user)
            } catch (err) {
                console.log('error 4')
                reject('User not found!')
            }
        })
    }

    destroy() {
        return new Promise (async (resolve, reject) => {
            try {
                const result = await db.query(`DELETE FROM users WHERE user_id = $1 RETURNING user_id;`, [this.user_id])
                resolve(`User ${result.user_id} was successfully deleted.`)
            } catch (err) {
                reject('User could not be deleted.')
            }
        })
    }
   
}    

module.exports = User
