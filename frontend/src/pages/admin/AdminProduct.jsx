import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { setProducts } from "@/redux/productSlice";
import axios from "axios";
import { toast } from "sonner";

function AdminProduct() {
  const { products } = useSelector((state) => state.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  let filteredProducts = products.filter((product) => 
  product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if(sortOrder == "lowToHigh"){
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }
  else{
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("brand", editProduct.brand);
    formData.append("category", editProduct.category);

    // Add existing images public_ids
    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    // Add new files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updatedProducts));
        toast.success("Product updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProducts(remainingProducts));
      }
      else{
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  };

  return (
    <div className="pl-87.5 py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex justify-between mt-5">
        <div className="relative bg-white rounded-lg">
          <Input
            value = {searchTerm}
            onChange = {(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Product..."
            className="w-100 items-center"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        <Select onValueChange = {(value) => setSortOrder(value)}>
          <SelectTrigger className="w-50 bg-white">
            <SelectValue placeholder="Sort By Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.map((product, index) => (
        <Card key={index} className={"px-4"}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={product?.productImg[0]?.url}
                alt=""
                className="w-25 h-25 object-contain"
              />
              <h1 className="font-bold w-96 text-gray-700">
                {product.productName}
              </h1>
            </div>
            <h1 className="font-semibold text-gray-800">
              ₹{product.productPrice}
            </h1>
            <div className="flex gap-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Edit
                    onClick={() => {
                      (setOpen(true), setEditProduct(product));
                    }}
                    className="text-green-500 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-156.25 max-h-185 overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Edit product</DialogTitle>
                    <DialogDescription>
                      Make changes to your product here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <div className="grid gap-2">
                      <Label>Product Name</Label>
                      <Input
                        name="productName"
                        placeholder="Ex-Iphone"
                        required
                        type={"text"}
                        value = {editProduct?.productName}
                        onChange = {handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Price</Label>
                      <Input type={"number"} name="productPrice" required value = {editProduct?.productPrice}
                          onChange = {handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Brand</Label>
                        <Input
                          type={"text"}
                          name="brand"
                          placeholder="Ex-apple"
                          required
                          value = {editProduct?.brand}
                          onChange = {handleChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Input
                          type={"text"}
                          name="category"
                          placeholder="Ex-mobile"
                          required
                          value = {editProduct?.category}
                          onChange = {handleChange}

                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label>Description</Label>
                      </div>
                      <Textarea
                        value={editProduct?.productDesc}
                        onChange={handleChange}
                        name="productDesc"
                        placeholder="Enter brief description of product"
                      />
                    </div>
                    <ImageUpload productData={editProduct} setProductData={setEditProduct}/>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave} type="submit">
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 className="text-red-500 cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this product from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick = {()=> deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default AdminProduct;
