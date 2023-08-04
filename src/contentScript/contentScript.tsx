import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import "./contentScript.css";
import { Button, CardHeader, CardMedia, Divider, Typography } from "@mui/material";
import axios from "axios";
const App: React.FC<{}> = () => {
  const [value, setValue] = React.useState(0);

  const [list, setList] = React.useState([]);
  const [productQuantitys, setProductQuantity] = React.useState({ });

  const fetchProductInfo = async (productId) => {
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.get("http://localhost:3001/" + productId).then(function (response) {
      if (response.data.data) {
        setList((prev) => {
          let newArr = prev;
          newArr.push(response.data.data);
          return [
            ...new Map(
              newArr.map((item) => [item["product_name"], item])
            ).values(),
          ];
        });
      }
    });
  };

  const addProductQuantity = (itemId) => {
    setProductQuantity((prev) => {
      let oldQuantity = prev[itemId] ?? 0;
      return { ...prev, [itemId]: oldQuantity + 1 };
    });
  };

  const decreaseProductQuantity = (itemId) => {
    setProductQuantity((prev) => {
      let oldQuantity = prev[itemId] ?? 0;
       let newQuantity = oldQuantity - 1 ;
      return { ...prev, [itemId]: newQuantity <0 ? 0 : newQuantity};
    });
  };

  useEffect(() => {
    window.document.addEventListener("mouseover", (e) => {
      //@ts-ignore
      if (e.target.className == "product-record__heading--text") {
        fetchProductInfo(String(e.target.innerHTML).trim());
      }
    });
  }, []);

  let subTotal = Object.keys(productQuantitys).reduce((acc, key) => {
    let productData = list.filter(({ id }) => (id = key))[0];
    console.log("🚀 ~ file: contentScript.tsx:66 ~ subTotal ~ productData:", productData?.price)
    return (acc += Number(productData?.price.substr(1)) * productQuantitys[key]);
    // return 0;
  }, 0);

  return (
    <>
      <div className="overlayCard">
        <Card sx={{ minWidth: 275 }}>
          <CardHeader
            title="Nextbrain Shop That POC"
            subheader="Shopping Cart Items"
          ></CardHeader>
          <CardContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {list &&
              list.map((item, index) => {
                return (
                  <>
                    <Card
                      sx={{ maxWidth: 380, maxHeight: 300 }}
                      key={index}
                      style={{ margin: 8 }}
                    >
                      <CardMedia
                        sx={{ height: 140 }}
                        image={item.image}
                        title="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.product_name.substr(0,30)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price {item.price}
                        </Typography>
                        <Typography variant="h6" color="text.primary">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "end",
                            }}
                          >
                            <span
                              style={{ padding: 2 }}
                              onClick={() => decreaseProductQuantity(item.id)}
                            >
                              <RemoveIcon />
                            </span>
                            <span style={{ padding: 3 }}>
                              {productQuantitys[item.id] ?? 0}
                            </span>{" "}
                            
                            <span
                              style={{ padding: 2 }}
                              onClick={() => addProductQuantity(item.id)}
                            >
                              <AddIcon />
                            </span>{" "}
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                  </>
                );
              })}

           {list.length ? <>
            <Typography gutterBottom  component="div">
              SubTotal : {subTotal}
            </Typography>
            <Button variant="contained">CheckOut</Button>
           </> : ''} 
          </CardContent>
          <CardActions>
            <Box sx={{ width: 500 }}>
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction
                  label="Cart"
                  icon={<AddShoppingCartIcon />}
                />
                <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
              </BottomNavigation>
            </Box>
          </CardActions>
        </Card>
      </div>
    </>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
