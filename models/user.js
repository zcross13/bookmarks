require('dotenv').config()
const { Schema, model, SchemaType } = require('mongoose')
// schema tells model the way it needs to be strcutre
// model give function and allow us to talk to database 
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const SALT_ROUNDS = 6 
// how many rounds of salting we want to do 

const userSchema = new Schema ({
    name:{type:String, required:true}, 
    email:{type:String, unique:true, trim:true, lowercase:true, required:true}, //trim any blank text ignore 
    password:{type:String, trim:true, minLength:5, required:true }, 
    bookmarks: [{type: Schema.Types.ObjectId, ref: 'Bookmark'}]
}, {
    timestamps:true, 
    toJSON: {
        transform(doc, ret){
            delete ret.password
            return ret 
        } // make sure the password get delete from the document
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next() //use regular function instead of callback to get this to work 
    const password = crypto.createHmac('sha256', process.env.SECRET).update(this.password).digest('hex').split('').reverse().join('')// hash password 
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS) // run bcrpt hash on it and salt it 
})

module.exports = model('User', userSchema)