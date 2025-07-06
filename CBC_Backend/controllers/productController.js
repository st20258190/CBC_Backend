import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res) {
    if (!isAdmin(req)) {
        return res.status(403).json({message:"Access denied. Admin only"})
    }
    const product = new Product(req.body)
    try{
        const response = await product.save()
        res.json({
            message:"Product created successfully",
            product:response
        })
    }catch(error){
        return res.status(500).json(
            {message:"failed to create Product"}
        )
    }
}

export async function getProducts(req,res){
    try{
        if(isAdmin(req)){
            const products = await Product.find();
            return res.json(products);
        }else{
            const products = await Product.find({isAvailable:true});
            return res.json(products)

        }
        }catch(error){
            console.log("Error for fetching product: ",error)
            return res.status(500).json({message:"failed to fetch products"})

    }
}

export async function deleteProduct(req,res) {
    if (! isAdmin(req)) {
        res.status(403).json({message:"Acess denied."})
        return;
    }
    try{
        const productId = req.params.productId;
        await Product.deleteOne({
            productId:productId
        })
        res.json({message:"Product deleted Successfully"})
    }catch(error){
        console.log("error:",error);
        return res.status(500).json({message:"failed to delete Product"})
    }
}