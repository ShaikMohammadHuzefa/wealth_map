import React from 'react'
import Feed from '../components/Feed'
import Navbar from '../components/Navbar'
import Box from '@mui/material/Box';
import { SearchProvider } from '../context/SearchProvider'; 

const Home = () => {
  return (
  
    <SearchProvider> 
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ height: '64px' }}>  
          <Navbar />
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>  
          <Feed />
        </Box>
      </Box>
    </SearchProvider>




    
    
  )
}

export default Home
