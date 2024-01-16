import React, { useEffect, useState } from 'react'
import Asus from '../../Aseset/Asus2.jpg'
import { Link } from 'react-router-dom'
const Viewproduct = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [Msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [originalProducts, setOriginalProducts] = useState([]);
  // const [checkstock, setcheckstock] = useState([]);
  const [serachData, setserachData] = useState([]); //filter
  const [Query, setQuery] = useState("");
  // const categroy = [
  //   { label: "All Product" },
  //   { label: "Computer", path: "/computer" },
  //   { label: "Acessories", path: "/Acessories" },
  //   { label: "Game", path: "/Game" },
  // ]



  // useEffect(() => {
  //   isLoading(true)
  //   fetch('http://localhost/ugame_project/ugamerphp/Product/Product.php')
  //     .then(response => response.json())
  //     .then(data => setproducts(data))
  //     .catch(err => {
  //       setError(err);
  //       console.log(err);
  //     });

  // }, []);

  // useEffect(() => {
  //   setisLoading(true);
  //   fetch('http://localhost/ugame_project/ugamerphp/Product/SelectproductCategorycheck.php?allproductCategory')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setTimeout(() => {
  //         if (data && data.Result) {
  //           setmsg(data.Result)
  //         } else {
  //           setproducts(data);
  //         }
  //         setisLoading(false);
  //       }, 1000);
  //     })
  //     .catch((err) => {
  //       setError(err);
  //       console.log(err);
  //       setisLoading(false);
  //     })
  //     .finally(() => {

  //     });
  // }, []);
  // useEffect(() => {
  //   setisLoading(true);
  //   fetch('http://localhost/ugame_project/ugamerphp/Product/SelectproductCategorycheck.php')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data && data.Result) {
  //         setmsg(data.Result);
  //       } else {
  //         setCategory(data);
  //       }
  //       setisLoading(false);
  //     })
  //     .catch((err) => {
  //       setError(err);
  //       console.log(err);
  //       setisLoading(false);
  //     });
  // }, []);


  // const filterProductsByCategory = (category) => {
  //   if (category === "All Products") {
  //     setproducts(Category);
  //   } else {
  //     const filteredProducts = Category.filter((product) => product.Type === category);
  //     setproducts(filteredProducts);
  //   }
  // };
  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost/ugame_project/ugamerphp/Product/SelectproductCategorycheck.php?allproductCategory')
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data && data.Result) {
          setMsg(data.Result);
        
        } else {
          setProducts(data);
          setserachData(data)
          setOriginalProducts(data);
        }
      })
      .catch((err) => {
        setMsg(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost/ugame_project/ugamerphp/Product/SelectproductCategorycheck.php')
      .then((response) => response.json())
      .then((data) => {

        setIsLoading(false);
        if (data && data.result) {
          setMsg(data.result);
        } else {
          setCategories(data);
        }
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  //   const filterProductsByCategory = (category) => {
  //     setSelectedCategory(category);
  //     if (category === "All Products") {
  //       setProducts(products);
  //     } else {
  //       const filteredProducts = products.filter((product) => product.prodType === category);
  //       setProducts(filteredProducts);
  //     }
  // };
  const handserach = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setQuery(searchValue);

    if (searchValue.length > 0) {
      const searchResults =serachData.filter(
        (prod) =>
          prod.id.toLowerCase().includes(searchValue) ||
          prod.prodname.toLowerCase().includes(searchValue)||
          prod.prodType.toLowerCase().includes(searchValue)
        
      );    
      setProducts(searchResults);
    } else {
      setProducts(serachData); // Reset to all users when the search query is empty
    }
  };
  const filterProductsByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "All Products") {
      setProducts(originalProducts); // Restore original products
    } else {
      const filteredProducts = originalProducts.filter((product) => product.prodType === category);
      setProducts(filteredProducts);
    }
  };
  return (

    <div className='text-center '>
      
      <div className=' w-full h-[87vh] overflow-scroll overflow-y-auto overflow-x-hidden px-2'>
        <div className='py-2'>
          <h1 className='font-bold md:text-3xl sm:text-2xl '>All Products</h1>
          <div className='flex justify-center items-center gap-3 '>

            <button
              className={`cursor-pointer mt-2 font-semibold hover:text-red-600 ${selectedCategory === "All Products" && "text-red-600"}`}
              onClick={() => filterProductsByCategory("All Products")}
            >
              All Products
            </button>
            {categories.map((category, index) => (
              <button
                className={`cursor-pointer mt-2 font-semibold hover:text-red-600 ${selectedCategory === category.Type && "text-red-600"}`}
                key={index}
                onClick={() => filterProductsByCategory(category.Type)}
              >
                {category.Type}
              </button>
            ))}

          </div>
        </div>
<div className='flex justify-start items-starts'>
<input type="text" value={Query} onChange={(e) => handserach(e)} placeholder='Name or ID....' className='border p-2 mx-4 dark:bg-gray-500 dark:text-white shadow-md font-bold text-gray-600' />
</div>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 dark:bg-[#06080F] '>
          {error ? (

            <p className='text-red-500'>Something went wrong!</p>
            
          ) : isLoading ? (

            <p className=' text-green-500'>Loading....</p>

          ) : products.length === 0 ? (
            <p className='text-orange-500 '>No data available</p>
          ) :
            (products.map((product) => (

              <div key={product.id} className='md:border py-8 m-2 dark:bg-[#3f4042] bg-white shadow-lg relative p-2'>
                
                <div className='flex items-center justify-center'>
                  <img className='w-[275px] h-[200px] object-cover ' src={`http://localhost/ugame_project/ugamerphp/UploadPictureFolder/${product.img}`} alt='' />
                </div>
                <h4 className='font-bold my-4'>{product.prodname}</h4>

                <div className='border flex flex-col justify-start items-start p-2 '>
                <h6 className='text-left'>Product ID: <span className='text-red-500 '>{product.id}</span></h6>
                  <div className='flex items-center gap-2 '>
                    <label htmlFor="">Price: </label>
                    <span className='text-red-600'>${product.prodprice}</span>
                  </div>
                  <div className='flex items-center gap-2 '>
                    <label htmlFor="">Category: </label>
                    <span className='text-red-600'>{product.prodType}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <label htmlFor="">Quantity: </label>
                    <input value={product.qty} type='number' readOnly className='text-red-500  border pl-2 w-[70px] mr-3 dark:bg-[#3f4042] border-none' />
                  </div>
                </div>
                <div className=' absolute top-0 md:right-[-3%] sm:right-0 rotate-12 text-xl bg-[#d4d3d3] dark:bg-white rounded'>
                <span className={`${product.qty > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}`}>
                  {product.qty > 0 ? 'In stock' : 'Out of stock'}
                </span>
                </div>
                {/* <button className='flex items-center justify-center mb-2 bg-[#00df9a] w-[90%] rounded-md font-medium py-2 text-white hover:opacity-70 ml-3'>
                  Buy Now
                </button> */}
                {/* <button className='flex items-center justify-center bg-[#fd3737] w-[90%] rounded-md font-medium py-2 text-white hover:opacity-70 ml-3'>
                  Add Cart
                </button> */}


              </div>
            )))}
        </div>
      </div>
    </div>
  )
}

export default Viewproduct