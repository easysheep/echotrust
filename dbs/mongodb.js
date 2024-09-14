import mongoose from 'mongoose';

const connectToMongo=()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log('mongo healthy');

        
    } catch (error) {
        console.log(error);
        
    }

}
export default connectToMongo;