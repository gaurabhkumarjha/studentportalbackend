const mongoose = require("mongoose");

const DB= "mongodb+srv://gaurabhkumarjha:27102002@cluster0.e3lwsbo.mongodb.net/StudentLMSPortal?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose.connect(DB,{
     
}).then(()=> console.log("Database connected..")).catch((err)=>{
    console.log(err);
})