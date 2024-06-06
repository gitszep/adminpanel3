import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  cartProducts:Object,
  name:String,
  email:String,
  city:String,
  postalCode:String,
  streetAddress:String,
  country:String,
  paid:Boolean,
  selectedDeliveryOption: {type:String, default:null},
  selectedParcelLocker: {type:Object, default:null},
  tpayTransactionId: String,
  tpayStatusChecked: {type: Boolean, default: false},
  tpayTransaction: Object,
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);