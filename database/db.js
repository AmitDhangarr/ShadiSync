import mongoose from "mongoose";

export function DBconnection (URL){
 return mongoose.connect(URL)
};
;