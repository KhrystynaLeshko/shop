import { Badge } from "@material-ui/core";
import { Search, ShoppingCartOutlined } from '@material-ui/icons';
import React from 'react';
import { styled } from 'styled-components';
import {mobile} from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/apiCalls";

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px"})};
`

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mobile({ padding: "10px 0px"})};
`

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

const SearchContainer= styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`

const Input = styled.input`
  border: none;
  ${mobile({ width: "50px"})};
`

const Center = styled.div`
  flex: 1;
  text-align: center;
`

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px"})};
`

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ justifyContent: "center", flex: "2"})};
`

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px"})};
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-weight: 400;
  border: none;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

export default function Navbar() {
  const quantity = useSelector(state => state.cart.quantity);

  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  // USES LOGOUTUSER FUNCTION FROM REDUX
  const handleLogout = () => {
    logoutUser(dispatch);
  }

  return (
    <Container>
      <Wrapper>
          <Left>
            <SearchContainer>
              <Input placeholder="Search"/>
              <Search style={{color:"gray", fontSize:16}}/>
            </SearchContainer>
          </Left>
          <Center>
            <Link to="/" style={{ textDecoration: "none"}}>
              <Logo>SIMBA.</Logo>
            </Link>
          </Center>
          <Right>
            {user ? (
              <>
                <MenuItem>
                  <Button onClick={handleLogout}>LOGOUT</Button>
                </MenuItem>
              </>
          // SHOW REGISTER & LOGIN BTN IF THERE IS NO USER
            ) : (
              <>
                <Link to="/register" style={{ textDecoration: "none"}}>
                <MenuItem>REGISTER</MenuItem>
              </Link>
              <Link to="/login" style={{ textDecoration: "none"}}>
                <MenuItem>LOG IN</MenuItem>
              </Link>
              </>
            )}

            <Link to="/cart">
              <MenuItem>
                <Badge overlap="rectangular" badgeContent={quantity} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </MenuItem>
            </Link>
          </Right>
      </Wrapper>
    </Container>
  )
}
