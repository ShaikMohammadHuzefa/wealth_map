import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button"; // Import Button
import { SearchContext } from "../context/SearchContext"; // Import Context
import AccountCircle from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton'; // If using Material-UI
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem
import { useNavigate } from "react-router-dom";



const currUsername = sessionStorage.getItem("currUser");


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function NavBar() {
  const { setSearchQuery } = React.useContext(SearchContext);
  const [inputValue, setInputValue] = React.useState(""); // Local state for input
  const [anchorElUser, setAnchorElUser] = React.useState(null);
   const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
    const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
      const handleLogout = async () => {
    try {
        const response = await fetch("http://localhost:3000/logout", { 
            method: "GET", 
            credentials: "include" 
        });

        if (!response.ok) {
            throw new Error("Logout failed! Please try again.");
        }

        sessionStorage.clear(); // Remove session data
        alert("You have logged out successfully!");
        handleCloseUserMenu(); 
        navigate("/login"); // Redirect to login page
    } catch (error) {
        alert(error.message); // Show an alert if logout fails
        console.error("Logout Error:", error);
    }
};


  return (
    <Box sx={{ flexGrow: 1, height: "64px" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
            Wealth Map
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={inputValue} // Bind input field to local state
              onChange={(e) => setInputValue(e.target.value)} // Update local state
            />
          </Search>
          <Button variant="contained" color="primary" onClick={() => setSearchQuery(inputValue)}> {/* Update searchQuery only when clicked */}
            Search
          </Button>
                    <Box sx={{ flexGrow: 1 }} /> {/* This pushes the icon to the end */}
                    <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <AccountCircle />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign={"center"}>@{currUsername}</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>

                      </Menu>
                    </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
