import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Handle multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // create a product in DB
    const product = await Product.create({
      userId,
      productDesc,
      productName,
      productPrice,
      category,
      brand,
      productImg,
    });

    return res.status(200).json({
      success: true,
      message: "Product added Successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (_, res) => {
  try {
    const allProducts = await Product.find();

    if (!allProducts) {
      res.status(404).json({
        success: false,
        message: "No product Available",
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      console.log("Product not found")
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete Images from Cloudinary

    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = []

    // Keep selected old images

    if(existingImages){
        const keepIds = JSON.parse(existingImages)
        updatedImages = product.productImg.filter((img) => keepIds.includes(img.public_id)) 

        // delete only removed images
        const removedImages = product.productImg.filter((img) => !keepIds.includes(img.public_id))

        for(let img of removedImages){
            await cloudinary.uploader.destroy(img)
        }

    } else {
        updatedImages = product.productImg
    }

    // upload new images if any
    if(req.files && req.files.length > 0){
        for(let file of req.files){
            const fileUri = getDataUri(file)
            const result = await cloudinary.uploader.upload(fileUri, {folder: "mern_products"})
            updatedImages.push({
                url: result.secure_url,
                public_id: result.public_id
            })
        }
    }

    // Update product in the database

    product.productName = productName || product.productName
    product.productDesc = productDesc || product.productDesc
    product.productPrice = productPrice || product.productPrice
    product.category = category || product.category
    product.brand = brand || product.brand
    product.productImg = updatedImages

    await product.save()

    return res.status(200).json({
        success: true,
        message: "Product updated Successfully",
        product
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
