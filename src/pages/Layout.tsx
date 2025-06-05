// src/pages/Layout.tsx (Después)
import { Flex, Spinner } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar"; 


const Layout = () => {
  const isLoading = false; // Mantengo tu lógica de carga
  
  return (
    <Flex direction="column" minH="100vh"> {/* Cambiado a 'column' y minH para ocupar toda la altura */}
      <Navbar /> {/* Aquí colocamos la Navbar */}
      
      {isLoading ? (
        <Flex justify="center" align="center" flex="1"> {/* flex="1" para ocupar el resto del espacio */}
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : (
        <Flex flex="1" p={4} maxW="large" mx="auto" w="full"> {/* flex="1" para que el contenido ocupe el resto del espacio, p para padding, maxW y mx="auto" para centrar contenido */}
          <Outlet />
        </Flex>
      )}
    </Flex>
  );
};

export default Layout;