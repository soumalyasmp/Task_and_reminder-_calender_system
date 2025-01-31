const mongoose=require('mongoose');
require('dotenv').config();
const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('mongodb connected')
    }
    catch(err){
        console.log('mongodb connection error',err.message)
        process.exit(1);
    }
}
module.exports=connectdb;