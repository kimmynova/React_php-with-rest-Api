import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../alertmesengebox/alert';
import { DatetimeContext } from '../../alertmesengebox/date';
import Purchase_print from './Purchase_print';
import Supplier from '../Supplier/Supplier';

const Purchase_order = () => {
  const [pono, setinvno] = useState("")
  const [Employee, setemployee] = useState(localStorage.getItem('Name'));
  const [showinvoce, setShowInvoice] = useState(false)
  const [supplier, setsupplier] = useState([])
  const { datetime: currentDate } = useContext(DatetimeContext);
  const [productitems, setProductitems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState("");
  const [subtotal, setsubtotal] = useState(0);
  const [Grandtotal, setGrandtotal] = useState(0);
  const [Remark, setRemark] = useState("");
  const [discount, setdiscount] = useState("")
  const [error, SetError] = useState("")
  const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };
  const [Date, setdate] = useState(formatDate(currentDate))
  const [productData, setProductData] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availablesupplier, setAvailablesupplier] = useState([]);
  const [selectedsupplier, setselectedsupplier] = useState("");
  const [stock, setstock] = useState("");
  const [isProductOutOfStock, setIsProductOutOfStock] = useState(false);
  const Alertbox = useContext(AlertContext);
  const [isLoading, setLoading] = useState(false);
  const [Msg, setMsg] = useState("");
  const [customProduct, setCustomProduct] = useState('');


  // const handleRow = async () => {

  //   if (!selectedProduct || !unitPrice || !quantity || !total) {
  //     console.log("Please insert all values");
  //     Alertbox.organize();
  //     return;
  //   }
  //   // Create a new row with the selected values
  //   const existingProductIndex = productitems.findIndex(item => item.itemid === selectedProduct);
  //   if (existingProductIndex !== -1) {
  //     // If the product already exists, update its quantity
  //     const updateItems = [...productitems];
  //     updateItems[existingProductIndex].quantity += Number(quantity);
  //     updateItems[existingProductIndex].total += Number(total);
  //     setProductitems(updateItems);
  //   } else {
  //     const newRow = {
  //       No: productitems.length + 1,
  //       itemid: selectedProduct,
  //       unitprice: unitPrice,
  //       quantity: Number(quantity),
  //       total: Number(total)
  //     };
  //     setProductitems([...productitems, newRow]);
  //   }
  //   setSelectedProduct("");
  //   setUnitPrice("");
  //   setQuantity("");
  //   setTotal("");
  // }
  const handleRow = async () => {
    if (!unitPrice || !quantity || !total) {
      console.log("Please insert all values");
      Alertbox.organize();
      return;
    }

    // Check if the user selected an existing product or entered a custom one
    const selectedProductItem = availableProducts.find((product) => product.prodname === selectedProduct);

    if (selectedProductItem) {
      // If the user selected an existing product, use its name
      const existingProductIndex = productitems.findIndex((item) => item.itemid === selectedProductItem.prodname);

      if (existingProductIndex !== -1) {
        // If the product already exists, update its quantity
        const updateItems = [...productitems];
        updateItems[existingProductIndex].quantity += Number(quantity);
        updateItems[existingProductIndex].total += Number(total);
        setProductitems(updateItems);
      } else {
        const newRow = {
          No: productitems.length + 1,
          itemid: selectedProductItem.prodname,
          unitprice: unitPrice,
          quantity: Number(quantity),
          total: Number(total),
        };
        setProductitems([...productitems, newRow]);
      }
    } else if (selectedProduct === "custom") {
      // If the user entered a custom product, use the custom product name
      if (!customProduct) {
        console.log("Please enter a custom product name");
        Alertbox.organize();
        return;
      }
      const newRow = {
        No: productitems.length + 1,
        itemid: customProduct,
        unitprice: unitPrice,
        quantity: Number(quantity),
        total: Number(total),
      };
      setProductitems([...productitems, newRow]);
    }

    setSelectedProduct("");
    setCustomProduct("");
    setUnitPrice("");
    setQuantity("");
    setTotal("");
  };

  const handleRemove = (indexToRemove) => {
    setProductitems((prevInputList) =>
      prevInputList.filter((_, index) => index !== indexToRemove)
        .map((item, index) => ({ ...item, No: index + 1 }))
    );
  }
  //////////////////////////////////////////// calculate
  useEffect(() => {
    const caculation = () => {
      setTotal(unitPrice * quantity)
    }
    caculation();
  }, [unitPrice, quantity])

  useEffect(() => {
    //reduce use sum with /totla propertery
    const calculatedGrandTotal = productitems.reduce(
      (accumulator, item) => accumulator + item.total,
      0

    );
    setsubtotal(calculatedGrandTotal)
    setGrandtotal(calculatedGrandTotal);
  }, [productitems]);

  // useEffect(() => {

  //   const calculateDiscount = () => {
  //     const subTotal = productitems.reduce((acc, item) => acc + item.total, 0);
  //     return (subTotal * (discount / 100)).toFixed(2); // Assuming discount is a percentage.
  //   };
  //   calculateDiscount()
  //   setGrandtotal(calculateDiscount)
  // })
  ///////////////////////////////////////////////////////
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost/ugame_project/ugamerphp/Invoice/product.php')
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          if (data && data.Resault) {
            setMsg(data.Resault);
          } else {
            setAvailableProducts(data);
          }
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        SetError('An error occurred while fetching data');
        setLoading(false);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost/ugame_project/ugamerphp/Purchase/checksuppler.php')
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          if (data && data.result) {
            setMsg(data.result);
          } else {
            setAvailablesupplier(data);
          }
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        SetError(err);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const selectedProductData = availableProducts.find((product) => product.prodname === selectedProduct);
      const selectedProductPrice = selectedProductData ? selectedProductData.prodprice : 0;
      setUnitPrice(selectedProductPrice);
    }
  }, [selectedProduct, availableProducts]);

  // useEffect(() => {
  //   const selectedCustomerData = availablesupplier.find((customer) => customer.custname === selectedCustomer);
  //   setcustomer(selectedCustomerData);
  // }, [availablesupplier]);

  ////////////////////////////////////
  const featchinvo = async () => {
    try {
      const res = await fetch("http://localhost/ugame_project/ugamerphp/GenerateUniqkey/pur_gen.php");
      console.log(res)
      if (res.ok) {
        const data = await res.json();
        setinvno(data.PurchaseNumber); // Update the pono state with the fetched value
      
      } else {
        console.error("Failed to fetch pono");
      }
    } catch (error) {
      console.error("Error fetching pono:", error);
    }
  };

  useEffect(() => {
    featchinvo();
  }, []);
  ///////////////////////////////////////////////////////////////////////////
  ///outstock problem
  const handleProductSelection = async (e) => {
    const selectedProduct = e.target.value;
    setSelectedProduct(selectedProduct);
    setQuantity(1);

    try {
      const response = await fetch(
        `http://localhost/ugame_project/ugamerphp/Invoice/Invoice_product.php?prodname=${selectedProduct}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          console.error(data.error); // Handle any errors from the server
        } 
      } else {
        console.error("Failed to fetch stock status.");
      }
    } catch (error) {
      console.error("Error checking stock status:", error);
    }

  };
  const handleCustomProductInput = (e) => {
    const inputValue = e.target.value;
    setCustomProduct(inputValue);
  };
  // const handleCustomerSelection = (e) => {
  //   const selectedValue = e.target.value;
  //   if (selectedValue === "") {
  //     setcustomer("Owner");
  //   } else {
  //     setcustomer(selectedValue);
  //   }
  // };

  { stock && <p className="text-red-500 ">t{stock}</p> }

  return (
    <>
      {isProductOutOfStock && <p className="text-red-500 text-center">This Product is out of stock.</p>}
      {showinvoce ? (
        <div>
          <Purchase_print
            Employee={Employee}
            pono={pono}
            productitems={productitems}
            setShowInvoice={setShowInvoice}
            supplier={supplier}
            Date={Date}
            subtotal={subtotal}
            Grandtotal={Grandtotal}
            Remark={Remark}
          />

        </div>
      ) : (

        <div className='border w-[80%] h-[80vh] my-4  m-auto shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
          <section className=' flex items-center justify-between px-4 py-2 text-white border-y bg-[#2980b9] dark:bg-[#3f4042] '>
            <div className='flex flex-col'>
              <span>pono: {pono}</span>
              <div>
                <span>Purchase Date: {formatDate(currentDate)}</span>
                {/* <input className='border text-black border-none' type="text" name='currentDate' value={formatDate(currentDate)}  onChange={(e) =>formatDate(e.target.value)}  /> */}

              </div>
            </div>
            <h1 className=' font-bold text-3xl'>Purchase Order</h1>
            <div>
              {/* <span value={Employee} onChange={(e) => setemployee(e.target.value)} >Employee: {Employee} </span> */}

            </div>
            <div>
              <span>Supplierid: </span>
              <select
                name="supplier"
                className='text-black'
                value={supplier}
                onChange={(e) => setsupplier(e.target.value)}
              >

                {error ? (
                  <option value="">Something went wrong!</option>
                ) : isLoading ? (
                  <option value="">Loading....</option>
                ) : availablesupplier.length === 0 ? (
                  <option value="">No data available</option>
                ) : (
                  <>
                    <option value="">Select Supplier</option>

                    {availablesupplier.map((customer, index) => (
                      <option key={index} value={customer.supid}>
                        {customer.supid}
                      </option>
                    ))}
                  </>
                )}
              </select>

            </div>
          </section>

          <section className='px-2 grid grid-cols-6'>
            <select
              name=""
              className='m-2 border border-gray-500 dark:text-black py-3'
              value={selectedProduct}
              onChange={handleProductSelection}
            >

              {error ? (
                <option value="">Something went wrong!</option>
              ) : isLoading ? (
                <option value="">Loading....</option>
              ) : availableProducts.length === 0 ? (
                <option value="">No data available</option>
              ) : (
                <>

                  <option value="">Select product</option>
                  {availableProducts.map((product, index) => (
                    <option
                      key={index}
                      value={product.prodname}
                      disabled={product.outOfStock} // Disable the option for out-of-stock products
                    >
                      {product.prodname}
                    </option>
                  ))}
                  <option value="custom">Other (Custom)</option>
                </>
              )}
            </select>
            {selectedProduct === 'custom' && (
              <input className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right'
                type="text"
                placeholder="Enter custom product"
                value={customProduct}
                onChange={handleCustomProductInput}
              />)}
            <input
              className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right'
              type="text"
              placeholder='Unit price'
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}

            />

            <input
              className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right'
              type="number"
              placeholder='Quantity'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right'
              type="number"
              placeholder='Total'
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
            <div className='flex items-center gap-2 justify-center'>
              {stock && <p className="text-red-500">{stock}</p>}
              <button onClick={handleRow} className='bg-[#2980b6] text-white w-full h-[50px] rounded'>Add Product</button>
              <button className='border bg-[#299e29] text-white w-full h-[50px] rounded' onClick={() => setShowInvoice(true)}>Print Save</button>
            </div>
          </section>
          <section className='flex items-center flex-col justify-center '>
            <table className='border-y w-full overflow-scroll overflow-x-auto'>
              <thead>
                <tr className=' grid grid-cols-6 p-4 gap-10 bg-[#2980b9] dark:bg-[#3f4042] text-white'>
                  <th>No</th>
                  <th>Itemid</th>
                  <th>unitprice</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              {productitems.map((item, i) => (
                <tbody className='' key={i} >
                  <tr className='grid grid-cols-6 px-4  gap-10 ml-7 pt-3 ' >
                    <td className='ml-[30%]' value={item.No} onChange={(e) => item(e.target.value)}>{item.No}</td>
                    <td className='ml-[30%]' value={item.itemid} onChange={(e) => item(e.target.value)}>{item.itemid}</td>
                    <td className='ml-[30%]' value={item.unitprice} onChange={(e) => item(e.target.value)}>${item.unitprice}</td>
                    <td className='ml-[30%]' value={item.quantity} onChange={(e) => item(e.target.value)}>{item.quantity}</td>
                    <td className='ml-[30%]' value={item.total} onChange={(e) => item(e.target.value)}>${item.total}</td>
                    <td className='ml-[20%]'><div className='flex gap-2 '><button onClick={() => handleRemove(i)} className='w-[30px] h-[30px] rounded hover:bg-orange-300 opacity-90'>⛔</button>
                      <button className='w-[30px] h-[30px] rounded hover:bg-orange-300 opacity-90'>📝</button>
                    </div>
                    </td>
                  </tr>
                </tbody>
              ))}

            </table>
          </section>


          <div className=' flex items-center justify-end py-4 px-4 gap-10 bg-[#2980b9] dark:bg-[#3f4042] text-white'>
          <label htmlFor="">Remark: </label>
         <input value={Remark} onChange={(e) => setRemark(e.target.value)}type="text" className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right text-gray-600' />
            <span className='font-bold' value={subtotal} onChange={(e) => e.target.value}><h1>SubTotal: ${subtotal}</h1></span>
            <span className='font-bold' value={Grandtotal} onChange={(e) => e.target.value}>GrandTotal: ${Grandtotal}</span>
            {/* <Link to={"/print_invoice"} Employee={Employee} pono={pono} productitems={productitems}></Link> */}
          </div>

        </div >
      )}
    </>
  )
}

export default Purchase_order