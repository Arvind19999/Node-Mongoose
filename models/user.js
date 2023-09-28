const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    phoneNum : { 
        type  : String,
        required : true
    },
    cart:{
        items : [{
            productId :{type : Schema.Types.ObjectId,ref:'Product', required : true},
            quantity : {type : Number, required : true} 
        }]
    }
})

userSchema.methods.addToCart = function(product){
    const cartItemIndex = this.cart.items.findIndex(cp=>{
        return cp.productId.toString() == product._id.toString()
    })

    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    if(cartItemIndex >= 0){
        newQuantity = this.cart.items[cartItemIndex].quantity + 1
        updatedCartItems[cartItemIndex].quantity = newQuantity
    }else{
        updatedCartItems.push({
            productId : product._id,
            quantity : 1
        })
    }

    const updatedCart = {
        items : updatedCartItems
    }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.deleteCartItems = function(prodId){
    const updatedCartItems = this.cart.items.filter(item=>{
        return item.productId.toString() !== prodId
    })
    this.cart.items = updatedCartItems;
    return this.save()
}

userSchema.methods.clearCartItems = function(){
    this.cart = {
        items : []
    }
    return this.save()
}

module.exports = mongoose.model('User',userSchema);