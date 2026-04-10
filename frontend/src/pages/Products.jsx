import FilterSidebar from "@/components/FilterSidebar";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

function Products() {
  const { products } = useSelector((state) => state.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 9999999]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const[sortOrder, setSortOrder] = useState("");
  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getAllProducts",
      );
      if (res.data.success) {
        console.log(res.data.products)
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(()=>{
    if(allProducts.length === 0) return;

    let filtered = [...allProducts]
    if(search.trim() !== ""){
        filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
    }
    if(category !== "All"){
      filtered = filtered.filter(p => p.category === category)
    }
    if(brand !== "All"){
      filtered = filtered.filter(p => p.brand === brand)
    }

    filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

    if(sortOrder == "lowToHigh"){
      filtered.sort((a,b)=> a.productPrice - b.productPrice)
    }else if(sortOrder == "highToLow"){
      filtered.sort((a,b)=> b.productPrice - a.productPrice)

    }

    dispatch(setProducts(filtered))

  },[brand, category, search, priceRange, sortOrder, allProducts, dispatch])

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* sidebar */}
        <FilterSidebar
            allProducts={allProducts}
            priceRange={priceRange}
            setPriceRange = {setPriceRange}
            search ={search}
            setSearch = {setSearch}
            category = {category}
            setCategory = {setCategory}
            brand = {brand}
            setBrand = {setBrand}
        />
        {/* Main Product Section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValueChange = {(value)=> setSortOrder(value)}>
              <SelectTrigger className="w-full max-w-48">
                {" "}
                {/* w-[200px] */}
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
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {products.map((product) => (
              <ProductCard
                product={product}
                key={product._id}
                loading={loading}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
