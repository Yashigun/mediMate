import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({
    name: {type:String, required:true},  //this means that the doctor's name is mandatory in the DB
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    image: {type:String,required:true}, 
    speciality: {type:String,required:true}, 
    degree: {type:String,required:true}, 
    experience: {type:String,required:true}, 
    about: {type:String,required:true}, 
    available: {type:Boolean,required:true}, 
    fees: {type:Number,required:true}, 
    address: {type:Object,required:true}, 
    date_of_creation: {type:Number,required:true}, 
    slots_booked: {type:Object, default:{}}
}, {minimize:false}) //using minimize false we can enter an empty object as default

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema) //if model is available we will use it otherwise we will create it using doctorSchema

export default doctorModel