"use strict";var mongoose=require("mongoose");mongoose.Promise=global.Promise;var bcrypt=require("bcrypt"),usuariosSchema=new mongoose.Schema({email:{type:String,unique:!0,lowercase:!0,trim:!0},nombre:{type:String,required:!0},password:{type:String,required:!0,trim:!0},token:String,expira:Date,imagen:String});usuariosSchema.pre("save",function(r){var s;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.isModified("password")){e.next=2;break}return e.abrupt("return",r());case 2:return e.next=4,regeneratorRuntime.awrap(bcrypt.hash(this.password,12));case 4:s=e.sent,this.password=s,r();case 7:case"end":return e.stop()}},null,this)}),usuariosSchema.post("save",function(e,r,s){"MongoError"===e.name&&11e3===e.code?s("Ese correo ya esta registrado"):s(e)}),usuariosSchema.methods={compararPassword:function(e){return bcrypt.compareSync(e,this.password)}},mongoose.exports=mongoose.model("Usuarios",usuariosSchema);