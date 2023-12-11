import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { styled } from 'styled-components';
import { DeleteForever, Add, FavoriteBorderOutlined, Remove, ShoppingCartOutlined } from '@material-ui/icons'
import { mobile } from '../responsive';
import { useSelector, useDispatch } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { userRequest } from '../requestMethods';
import { useNavigate } from 'react-router-dom';
import { resetCart, updateQuantity } from "../redux/cartRedux";

const KEY = import.meta.env.VITE_REACT_APP_STRIPE_KEY;

const Container = styled.div`

`

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px"})}
`

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column"})}
`

const Info = styled.div`
  flex: 3;
`

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  ${mobile({ flexDirection: "column"})}
`

const ProductDetail = styled.div`
  flex: 2;
  display: flex;

`

const Image = styled.img`
  width: 200px;
`

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const ProductName = styled.span`
  display: flex;
  gap: 4px;
`

const ProductId = styled.span`
  display: flex;
  gap: 4px;
`

const ProductColor = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`

const ProductSize = styled.span`
  display: flex;
  gap: 4px;
`

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px"})}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px"})}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const ClearCartContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 20px;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`

const ClearText = styled.div`

`

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`
const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: teal;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleQuantity = (type) => {
  //   if (type === "dec") {
  //     quantity > 1 && setQuantity(quantity - 1);
  //   } else {
  //     setQuantity(quantity + 1);
  //   }
  // };

  // UPDATE QUANTITY functionality
  const handleQuantity = (type, productId) => {
    const updatedCart = cart.products.map((product) => {
      if (product._id === productId) {
        return {
          ...product,
          quantity: type === "dec" ? Math.max(1, product.quantity - 1) : product.quantity + 1,
        };
      }
      return product;
    });
    console.log('updatedCart:', updatedCart);
    dispatch(updateQuantity(updatedCart));
  };

// CLEAR CART functionality
  const handleReset = () => {
    dispatch(
      resetCart(cart)
    );
  };

// STRIPE CHECKOUT
  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
      const res = await userRequest.post("/checkout/payment", {
        tokenId: stripeToken.id,
        amount: 500,
      });
      navigate("/success",{data: res.data});
    } catch (error) {
      if (error.response){
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
    };
    stripeToken && makeRequest();
  }, [stripeToken, cart.total, navigate]);

  return (
    <Container>
      <Navbar/>
      <Announcement/>
      <Wrapper>
        <Title>YOUR SHOPPING CART</Title>
        <Bottom>
          <Info>
          {cart.products.map((product) => (
            <Product key={product._id}>
              <ProductDetail>
                <Image src={product.img}/>
                <Details>
                  <ProductName><b>Product:</b>{product.title}</ProductName>
                  <ProductId><b>ID:</b>{product._id}</ProductId>
                  <ProductColor color={product.color}/>
                  <>
                  {product.size && <ProductSize><b>Size:</b>{product.size}</ProductSize>}
                  </>
                </Details>
              </ProductDetail>
              <PriceDetail>
                <ProductAmountContainer>
                  <Remove onClick={() => handleQuantity("dec", product._id)}/>
                  <ProductAmount>{product.quantity}</ProductAmount>
                  <Add onClick={() => handleQuantity("inc", product._id)}/>
                </ProductAmountContainer>
                <ProductPrice>$ {product.price * product.quantity}</ProductPrice>
              </PriceDetail>
            </Product>
          ))}
            <Hr/>
            <ClearCartContainer>
              <DeleteForever />
              <ClearText onClick={handleReset}>Clear Cart</ClearText>
            </ClearCartContainer>

          </Info>
          <Summary>
          <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <StripeCheckout
              name="SIMBA."
              image="https://imgur.com/wbDh9cw.png"
              billingAddress
              shippingAddress
              description={`Your total is $${cart.total}`}
              amount={cart.total * 100}
              token={onToken}
              stripeKey={KEY}>
            <Button>CHECKOUT NOW</Button>
            </StripeCheckout>
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer/>
    </Container>
  )
}

export default Cart
