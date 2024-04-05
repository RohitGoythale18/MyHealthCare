const mongoose = require("mongoose");
const service = require('../model/service');
const PORT = process.env.PORT || 8080;

async function mongooseConnection(app) {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    console.log("Database connected successfully");
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
}

module.exports = mongooseConnection;
