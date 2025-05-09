const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect('mongodb+srv://malikvaibhav600:Dwu6km0vGCziLP8i@cluster0.4wiibbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

module.exports = connectToDb;
