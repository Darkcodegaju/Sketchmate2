import React, { useState, useEffect, useRef } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarBrand,
  MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem ,
} from "mdb-react-ui-kit";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../redux/features/authSlice";
import { searchTours } from "../redux/features/tourSlice";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import logo from "./images/llog.png"
import './Header.css'


import user1 from './img/user.png'
import edit  from './img/edit.png'
import inbox from './img/envelope.png'
import settings from './img/settings.png'
import logout from './img/log-out.png'


import styled from 'styled-components';


const SearchbarDiv = styled.div`
display: none;
transition: all 0.5s ease-in-out;
&.show {
  display: block;
}
&.hide {
  display: none;
  
}
`;

const  DropdownItem = (props)=> {
  return(
    <li className = 'dropdownItem'>
      <img src={props.img}></img>
      <a> {props.text} </a>
    </li>
  );
}







const Header = () => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user?.token;
  const firstLetter =  user?.result?.name[0].toUpperCase()+user?.result?.name.slice(1);
  

  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e)=>{
      if(!menuRef.current.contains(e.target)){
        setOpen(false);
        console.log(menuRef.current);
      }      
    };

    document.addEventListener("mousedown", handler);
    

    return() =>{
      document.removeEventListener("mousedown", handler);
    }

  });

 
  const [showSearchbar, setShowSearchbar] = useState(false);

  const toggleSearchbar = () => {
    setShowSearchbar(!showSearchbar);
  };


  const userIconStyles = {
    backgroundColor: '#F44336',
    color: '#fff',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
  };

  if (token) {
    const decodedToken = decode(token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(setLogout());
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      dispatch(searchTours(search));
      navigate(`/tours/search?searchQuery=${search}`);
      setSearch("");
    } else {
      navigate("/");
    }
  };

  
  const handleLogout = () => {
    dispatch(setLogout());
  };

  
 

 
  return (
    <MDBNavbar fixed="top"  expand="lg" style={{ backgroundColor: "transparent" , boxShadow: 'none'}}>
      <MDBContainer>

        <MDBNavbarBrand className="navbar-brand"
          href="/"
         
        >
          <img
        src={logo}
        height="70"
        alt="MDB Logo"
        loading="lazy"
      />

        </MDBNavbarBrand>
        <MDBNavbarToggler
        
          type="button"
          aria-expanded="false"
          aria-label="Toogle navigation"
          onClick={() => setShow(!show)}
          style={{color: "orange"}}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar  style={{color: "orange"}}>
          <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
          
            <MDBNavbarItem>
              <MDBNavbarLink  className="nav-link active" aria-current="page" href="/">
                <p className="header-text"   style={{ color: "#ffd1dc"}}>Home</p>
              </MDBNavbarLink>
            </MDBNavbarItem>
            {user?.result?._id && (
              <>
                <MDBNavbarItem   > 
                  <MDBNavbarLink href="/addTour">
                  
                  <p className="header-text hover-zoom"  style={{color: "#e6e8fa"}}>New Sketch</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/dashboard">
                    <p   className="header-text"  style={{color: "#fff0f5"}}>Dashboard</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
            {user?.result?._id ? (
              <div></div>
            ) : (
              <MDBNavbarItem >
                <MDBNavbarLink href="/login"   >
                  <p className="header-text"  style={{color: "#D3D3D3"}}>Login</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
          
          <form className="d-flex input-group w-auto" onSubmit={handleSubmit}>
          <SearchbarDiv className={`${showSearchbar ? "show" : "hide"}`}
      >
            <input
              type="text"
              style={{border:'2px solid blue', background: "transparent", color:"#F5F5F5"}}
              className="form-control " placeholder="Search " 
             
              value={search}
              
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchbarDiv>
             
            <div style={{ marginTop: "3px" , marginLeft:"10px"}}>
              <MDBIcon  className="search-icon"   style={{color:"Beige", marginRight:"10px"}}   onClick={toggleSearchbar}
         fas icon="search" />

            </div>
            
            
          </form>
          
          {user?.result?._id ? (
          <details class="dropdown">
    <summary role="button">
      <a class="button">{firstLetter}</a>
    </summary>
    <ul>
       
      <li><a href="/login" onClick={() => handleLogout()} >Logout</a></li>
      
  </ul>
</details>

//               <MDBDropdown group>
//               <MDBDropdownToggle color='dark'>{firstLetter}</MDBDropdownToggle>
//               <MDBDropdownMenu>
//                   <MDBDropdownItem  link onClick={() => handleLogout()}   href="/login" style={{color: "dark", cursor: "pointer", }}> Logout</MDBDropdownItem>
//                  </MDBDropdownMenu>
                
//               </MDBDropdown>
            ):( <div></div>)}
          
        

        
     
      
          
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Header;

