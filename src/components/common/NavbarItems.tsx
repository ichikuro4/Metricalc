import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiUsers } from "react-icons/fi";

const items = [
  { icon: FiBriefcase, title: "Cocomo 81", path: "/cocomo" },
  //{ icon: FiBriefcase, title: "Cocomo II", path: "/cocomo-two" },
  //{ icon: FiBriefcase, title: "Puntos de Funcion", path: "/function-point" },
  //{ icon: FiBriefcase, title: "Use Case Point", path: "/use-case-point" },
];

interface NavbarItemsProps {
  onClose?: () => void;
}

const NavbarItems = ({ onClose }: NavbarItemsProps) => {
  const textColor = useColorModeValue("ui.main", "ui.light");
  const currentUser = { email: "oscare.c.s@hotmail.com", is_superuser: false };

  const finalItems = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items;

  return (
    <Flex as="ul" listStyleType="none" ml="auto" display={{ base: "none", md: "flex" }}>
      {finalItems.map(({ icon, title, path }) => (
        <Flex
          as={Link}
          to={path}
          key={title}
          align="center"
          mx={3}
          color={textColor}
          _hover={{ textDecoration: "none", color: "ui.accent" }}
          onClick={onClose}
        >
          <Icon as={icon} />
          <Text ml={2}>{title}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default NavbarItems;
