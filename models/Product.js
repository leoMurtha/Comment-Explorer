const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Schema that will be used for the Material 
    Material has a name and type.
*/
/* Create Schema */
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    nota:{
        type: String
    },
    comments: [{type: String}],
    url: {
        type : String,
        required: true
    }, 
    img_url: {
        type: String
    }
});

mongoose.model('products', ProductSchema);