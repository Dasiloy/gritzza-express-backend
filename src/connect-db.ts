const mongoose = require("mongoose");

 export const connectDB = (url: string) => {
  return mongoose.connect(url);
};


