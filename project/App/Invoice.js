import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const Invoice = ({ route }) => {
  const { items } = route.params;
  const [invoiceNumber, setInvoiceNumber] = useState(1); // Initialize invoice number to 1
  const [finalTotal, setFinalTotal] = useState(0); // Initialize final total to 0

  // Function to get the current date in the format DD/MM/YYYY
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Update invoice number when items change
  useEffect(() => {
    setInvoiceNumber(prevInvoiceNumber => prevInvoiceNumber + 1);
  }, [items]);

  // Calculate final total based on invoice items
  useEffect(() => {
    const total = items.reduce((accumulator, item) => accumulator + parseInt(item.totalRate), 0);
    setFinalTotal(total);
  }, [items]);

  const handleShareAsPDF = async () => {
    const htmlContent = generateHTML(items); // Function to generate HTML content
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  };

  const generateHTML = (items) => {
    let rows = '';
    items.forEach((item, index) => {
      rows += `
        <tr>
          <td>${item.woodType}</td>
          <td>${item.width}</td>
          <td>${item.thick}</td>
          <td>${item.length}</td>
          <td>${item.quantity}</td>
          <td>${item.unit}</td>
          <td>${item.volumeOfUnit}</td>
          <td>${item.rate}</td>
          <td>${item.totalRate}</td>
        </tr>
      `;
    });
  
    return `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .header {
              margin-bottom: 10px;
            }
            .main-info{
                display: flex;
                justify-content: space-between;
                // margin-top: 20px;
                align-item: center;
            }
            .company-info {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
            }
            .address{
                width: 120;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
            }
            .total-cost {
              font-weight: bold;
              margin-top: 40px;
              margin-left: 650px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="main-info">
                <img src="https://woodenhut.in/wp-content/uploads/2024/01/wooden_hut-logo.png" alt="Company Logo" style="width: 70px; height: 70px;">
                <h1>Woodenhut.in</h1>
            </div>
            <p class="address">205/10G, Main Road, Ottangadu, Pattukottai TK, Thanjavur Dist - 614803</p>
            <div class="company-info">
              <p>Invoice No: ${invoiceNumber}</p>
              <p>Date: ${getCurrentDate()}</p>
            </div>
          </div>
          <h2>Invoice Items</h2>
          <table>
            <tr>
              <th>Wood</th>
              <th>Width</th>
              <th>Thick</th>
              <th>Length</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Volume</th>
              <th>Rate</th>
              <th>Total Rate</th>
            </tr>
            ${rows}
          </table>
          <p class="total-cost">Total cost: ${finalTotal}</p>
        </body>
      </html>
    `;
  };
  

  
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Image source={{ uri: 'https://woodenhut.in/wp-content/uploads/2024/01/wooden_hut-logo.png' }} style={{ width: 50, height: 50 }} /> 
        <Text style={{marginTop: 20,}}>Woodenhut.in</Text>
      </View>

      <Text style={{width: 120, marginTop: 20,}}>205/10G, Main Road, Ottangadu, Pattukottai TK, Thanjavur Dist - 614803</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Text>Invoice No: {invoiceNumber}</Text>
        <Text>Date: {getCurrentDate()}</Text>
      </View>

      {/* Display invoice items */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Invoice Items</Text>
        {items.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <Text>{item.woodType}</Text>
            <Text>{item.width}</Text>
            <Text>{item.thick}</Text>
            <Text>{item.length}</Text>
            <Text>{item.quantity}</Text>
            <Text>{item.unit}</Text>
            <Text>{item.volumeOfUnit}</Text>
            <Text>{item.rate}</Text>
            <Text>{item.totalRate}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20, marginLeft: 240, display:'flex', flexDirection:'row', }}>
        <Text style={{ fontWeight: 'bold' }}>Total cost:   </Text>
        <Text>{finalTotal}</Text>
      </View>

      <TouchableOpacity onPress={handleShareAsPDF} style={{ backgroundColor: '#6717f6', padding: 10, width: 320, marginTop: 30,marginLeft:20, borderRadius:5, height: 40,alignItems: 'center', }}>
        <Text style={{ color: 'white',  }}>Share as PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Invoice;
