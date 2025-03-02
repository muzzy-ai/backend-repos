import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Pesanan Di Proses"},
    date: { type: Date, default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000) }, // Mengatur UTC+7
    payment:{type:Boolean,default:false}
})

const orderModel = mongoose.models.order  || mongoose.model("order",orderSchema)
export default orderModel;