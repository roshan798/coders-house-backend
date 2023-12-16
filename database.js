import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL);


const connectDB = async () => {
    // console.log("called");
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export default connectDB;