const cartDataLayer = require('../dal/carts');

async function addToCart(userId, productId, quantity){
    // 1. check if the productId is already in the user's shopping cart
    const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId)
    if (!cartItem){
    // 2. if not then create new cart item
    await cartDataLayer.createCartItem(userId, productId, quantity);
    // 3. if yes, increasse the quantity in the cart item by 1
    }
    else{
        await cartDataLayer.updateQuantity(userId, productId, cartItem.get('quantity') + 1);
    }
    // // to show that the process was successful. return false if unsuccessful e.g. not enough stock
    return true;
}

async function getCart(userId){
    return cartDataLayer.getCart(userId);
}

async function updateQuantity(userId, productId, newQuantity){
    // todo: here check if the quantity matches the business rules
    // e.g. limited product where each person can only buyone
    return cartDataLayer.updateQuantity(userId, productId, newQuantity)
}

async function remove(userId, productId){
    return cartDataLayer.removeCartItem(userId, productId)
}

module.exports = { addToCart, getCart, updateQuantity, remove }