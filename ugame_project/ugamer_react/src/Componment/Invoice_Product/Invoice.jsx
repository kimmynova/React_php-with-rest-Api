import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Print_invoice from './Print_invoice';
import { useContext } from 'react';
import { DatetimeContext } from '../../alertmesengebox/date.js';
import { AlertContext } from '../../alertmesengebox/alert';


const Invoice = () => {
  const [invno, setinvno] = useState("")
  const [Employee, setemployee] = useState(localStorage.getItem('Name'));
  const [showinvoce, setShowInvoice] = useState(false)
  const [customer, setcustomer] = useState([""])
  const { datetime: currentDate } = useContext(DatetimeContext);
  const [productitems, setProductitems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState("");
  const [subtotal, setsubtotal] = useState(0);
  const [Grandtotal, setGrandtotal] = useState(0);
  const [Remark, setRemark] = useState("");
  const [PayCash, setPayCash] = useState("");
  const [Exchange, setExchange] = useState(parseFloat(0));
  const [discount, setdiscount] = useState("")
  const [error, SetError] = useState("")
  const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };
  const [Date, setdate] = useState(formatDate(currentDate))
  const [productData, setProductData] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableCusotmer, setAvailablecustomer] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState("");
  const [stock, setstock] = useState("");
  const [isProductOutOfStock, setIsProductOutOfStock] = useState(false);
  const Alertbox = useContext(AlertContext);
  const [isLoading, setLoading] = useState(false);
  const [Msg, setMsg] = useState("");
  const[Remaining,setRemaing]=useState(0)



  const handleRow = async () => {

    if (!selectedProduct || !unitPrice || !quantity || !total) {
      console.log("Please insert all values");
      Alertbox.organize();
      return;
    }

    // Create a new row with the selected values
    const existingProductIndex = productitems.findIndex(item => item.itemid === selectedProduct);
    if (existingProductIndex !== -1) {
      // If the product already exists, update its quantity
      const updateItems = [...productitems];
      updateItems[existingProductIndex].quantity += Number(quantity);
      updateItems[existingProductIndex].total += Number(total);
      setProductitems(updateItems);
    } else {
      const newRow = {
        No: productitems.length + 1,
        itemid: selectedProduct,
        unitprice: unitPrice,
        quantity: Number(quantity),
        total: Number(total)
      };
      setProductitems([...productitems, newRow]);
    }
    setSelectedProduct("");
    setUnitPrice("");
    setQuantity("");
    setTotal("");
  }




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

 
    //reduce use sum with /totla propertery
    // useEffect(() => {
    //   if(PayCash==""){
    //     setExchange(0)
    //   }else{
    //     const calculatedExchange = PayCash - Grandtotal ;
       
    //     if(PayCash<Exchange){
    //       const Remaingtotal = Grandtotal-PayCash  ;
    //       setRemaing(Remaingtotal)
          
    //     }else{

    //       setExchange(calculatedExchange);
    //     }
    //   }
    //   }, [Grandtotal, PayCash,Remaing]);
     
    
    
      // Calculate Exchange and Remaining
      useEffect(() => {
        if (PayCash === '') {
          setExchange(0);
          setRemaing(0);
        } else {
          const calculatedExchange = PayCash - Grandtotal;
    
          if (PayCash < Grandtotal) {
            const remainingTotal = Grandtotal - PayCash;
            setRemaing(remainingTotal);
            setExchange(0)
          } else {
            setRemaing(0);
            setExchange(calculatedExchange);
          }
        }
      }, [Grandtotal, PayCash]);
    
    
  

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
    fetch('http://localhost/ugame_project/ugamerphp/Invoice/customer.php')
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          if (data && data.Result) {
            setMsg(data.Result);
          } else {
            setAvailablecustomer(data);
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

  useEffect(() => {
    const selectedCustomerData = availableCusotmer.find((customer) => customer.custname === selectedCustomer);
    setcustomer(selectedCustomerData);
  }, [availableCusotmer]);

  ////////////////////////////////////
  const featchinvo = async () => {
    try {
      const res = await fetch("http://localhost/ugame_project/ugamerphp/GenerateUniqkey/invo_gen.php");
      if (res.ok) {
        const data = await res.json();
        setinvno(data.invoiceNumber); // Update the invno state with the fetched value
      } else {
        console.error("Failed to fetch invno");
      }
    } catch (error) {
      console.error("Error fetching invno:", error);
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
        } else if (data.outOfStock) {
          setUnitPrice("");
          setQuantity("");
          setTotal("");

          Alertbox.errorOutStock();
          setIsProductOutOfStock(true);

        } else {
          setIsProductOutOfStock(false);
        }
      } else {
        console.error("Failed to fetch stock status.");
      }
    } catch (error) {
      console.error("Error checking stock status:", error);
    }

  };
  // const handleCustomerSelection = (e) => {
  //   const selectedValue = e.target.value;
  //   if (selectedValue === "") {
  //     setcustomer("Owner");
  //   } else {
  //     setcustomer(selectedValue);
  //   }
  // };

  { stock && <p className="text-red-500 ">{stock}</p> }

  return (
    <>
      {isProductOutOfStock && <p className="text-green-500 flex justify-center gap-2  text-center">This <p className='text-red-500 '>{selectedProduct}</p> is out of stock.</p>}
      {showinvoce ? (
        <div>
          <Print_invoice
            Invno={invno}
            productitems={productitems}
            setShowInvoice={setShowInvoice}
            Employee={Employee}
            customer={customer}
            Date={Date}
            subtotal={subtotal}
            Grandtotal={Grandtotal}
            Remark={Remark}
            Exchange={Exchange}
            Remaining={Remaining}
          />
        </div>
      ) : (

        <div className='border w-[80%] h-[80vh] my-4  m-auto shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
          <section className=' flex items-center justify-between px-4 py-2 text-white border-y bg-[#2980b9] dark:bg-[#3f4042] '>
            <div className='flex flex-col'>
              <span >Invno: {invno}</span>
              <div>
                <span>Invo Date: {formatDate(currentDate)}</span>
                {/* <input className='border text-black border-none' type="text" name='currentDate' value={formatDate(currentDate)}  onChange={(e) =>formatDate(e.target.value)}  /> */}

              </div>
            </div>
            <h1 className=' font-bold text-3xl'>Invoice</h1>
            <div>
              <span value={Employee} onChange={(e) => setemployee(e.target.value)} >Employee: {Employee} </span>
              <div>
                <span>Customer: </span>
                {/* <select
                  name=""
                  className='text-black'
                  value={customer}
                  onChange={(e) => setcustomer(e.target.value)} // Update selectedCustomer, not setcustomer
                >

                  {error ? (
                    <option value="">Something went wrong!</option>
                  ) : isLoading ? (
                    <option value="">Loading....</option>

                  ) : availableCusotmer.length === 0 ? (
                    <option value="">No data available</option>
                  ) : (
                    <>
                      <option value="">Select Customer</option>
                      <option className="text-red-500" value="Owner-owner">
                        Default Name
                      </option>
                      {availableCusotmer.map((customer, index) => (
                        <option key={index} value={customer.custname}>
                          {customer.custname}
                        </option>
                      ))}
                    </>
                  )}
                </select>*/}
                <select
                  name=""
                  className={`text-black ${error ? 'text-red-500' : ''}`}
                  value={customer}
                  onChange={(e) => setcustomer(e.target.value)}
                >
                  {error ? (
                    <option value="">Something went wrong!</option>
                  ) : isLoading ? (
                    <option value="">Loading....</option>
                  ) : (
                    <>
                      <option value="">Select Customer</option>
                      <option className="text-red-500" value="Owner-owner">
                        Default Name
                      </option>
                      {availableCusotmer.length === 0 ? (
                        <option value="">No data available</option>
                      ) : (
                        availableCusotmer.map((customer, index) => (
                          <option key={index} value={customer.custname}>
                            {customer.custname}
                          </option>
                        ))
                      )}
                    </>
                  )}
                </select>


              </div>
            </div>
          </section>
          <section className='px-2 grid grid-cols-6'>
            {/* {selectedProduct.map((ProducT,i)=> */}
            {/* <select
              name=""
              className='m-2 border border-gray-500 dark:text-black py-3'
              value={selectedProduct} // Use selectedProduct as the selected value
              onChange={(e) => { setSelectedProduct(e.target.value); setQuantity(1); }}
            >
              <option value="">Select product</option>
              {availableProducts.map((product, index) => (
                <option key={index} value={product.prodname}>
                  {product.prodname}
                </option>
              ))}
            </select> */}


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
                      className={product.outOfStock ? 'text-red-500' : ''}
                    >
                      {product.prodname}
                    </option>
                  ))}
                </>
              )}
            </select>

            <input
              className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right'
              type="text"
              placeholder='Unit price'
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              readOnly
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
              readOnly
            />
            <div className='flex items-center gap-2 justify-center'>
              {stock && <p className="text-red-500">{stock}</p>}
              <button onClick={handleRow} className='bg-[#2980b6] text-white w-full h-[50px] rounded'>Add Product</button>
              <button className='border bg-[#299e29] text-white w-full h-[50px] rounded' onClick={() => setShowInvoice(true)}>Print Save</button>
            </div>
          </section>
          <section className=' flex items-center flex-col justify-center border max-h-[200px]   overflow-y-auto ' >
            <table className='w-full '>
              <thead>
                <tr className=' grid grid-cols-6 p-2 gap-10 bg-[#2980b9] dark:bg-[#3f4042] text-white'>
                  <th>No</th>
                  <th>Itemid</th>
                  <th>unitprice</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              {productitems.map((item, i) => (
                <tbody className='  ' key={i} >
                  <tr className='grid grid-cols-6 gap-10 ml-7 ' >
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


          {/* <input
  className='m-2 border border-gray-500 dark:text-black px-2 py-3 text-right'
  type="number"
  placeholder='Discount (%)'
  value={discount}
  onChange={(e) => setdiscount(Number(e.target.value))}
/> */}
          <div className=' flex items-end flex-col p-2 justify-end  bg-[#2980b9] dark:bg-[#3f4042] text-white'>
            <div className='flex items-center justify-center gap-2' >
              <span>Pay carsh: </span>
              <input placeholder='$' value={PayCash} onChange={(e)=>setPayCash(e.target.value)} type="number" className='p-2 border border-gray-500 text-black  text-right' />
            </div>
            <div className='flex items-center justify-center gap-2' >
              <label htmlFor="">Remark: </label>
              <input placeholder='Description' value={Remark} onChange={(e) => setRemark(e.target.value)} type="text" className='p-2 border border-gray-500 text-black  text-right' />
            </div>
            <span className='font-bold' value={subtotal} onChange={(e) => e.target.value}><h1>SubTotal: $ {subtotal}</h1></span>
            <span className='font-bold' value={Grandtotal} onChange={(e) => e.target.value}>GrandTotal: $ {Grandtotal}</span>
            <div className='flex gap-2'>
            <span  className='font-bold'>Exchange: $ </span>
            <p value={Exchange} onChange={(e)=>e.target.value} className='font-bold'>{Exchange}</p>
            </div>
            <div className='flex gap-2'>
            <span  className='font-bold'>Remaining: $ </span>
            <p value={Remaining} onChange={(e)=>e.target.value} className='font-bold'>{Remaining}</p>
            </div>
          </div>
        </div >
      )}
    </>
  )
}

export default Invoice