import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Box,
    Text,
    OrderedList,
    ListItem,
    UnorderedList,
    Divider,
    Badge,
    HStack,
} from "@chakra-ui/react";

interface FunctionPointHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FunctionPointHelpModal = ({ isOpen, onClose }: FunctionPointHelpModalProps) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: "sm", md: "lg", lg: "4xl" }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack>
                            <Text>Function Points - Guía de Uso</Text>
                            <Badge colorScheme="green" variant="subtle">
                                Guía Paso a Paso
                            </Badge>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={6} align="stretch">
                            <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px" borderLeftColor="blue.500">
                                <Text fontWeight="bold" color="blue.800" mb={2}>
                                    📏 ¿Qué son los Puntos de Función?
                                </Text>
                                <Text color="blue.700">
                                    Los Puntos de Función miden el tamaño funcional del software desde la perspectiva del usuario,
                                    independientemente de la tecnología utilizada.
                                </Text>
                            </Box>

                            <Box>
                                <Text fontSize="lg" fontWeight="bold" mb={4} color="green.600">
                                    Para medir el tamaño de tu software, sigue estos 4 pasos:
                                </Text>

                                <OrderedList spacing={4} pl={4}>
                                    <ListItem>
                                        <VStack align="stretch" spacing={3}>
                                            <Text fontWeight="bold" color="gray.800">
                                                🔍 Identifica las Funciones:
                                            </Text>
                                            <Text color="gray.700" ml={4}>
                                                Revisa el software y cuenta cuántas funciones de usuario hay en estas cinco categorías:
                                            </Text>
                                            
                                            <Box ml={6}>
                                                <UnorderedList spacing={2}>
                                                    <ListItem>
                                                        <HStack align="start">
                                                            <Badge colorScheme="blue" variant="outline">Entradas</Badge>
                                                            <Text fontSize="sm">
                                                                Formularios o pantallas donde el usuario ingresa datos que modifican algo 
                                                                (ej. crear un nuevo usuario).
                                                            </Text>
                                                        </HStack>
                                                    </ListItem>
                                                    
                                                    <ListItem>
                                                        <HStack align="start">
                                                            <Badge colorScheme="green" variant="outline">Salidas</Badge>
                                                            <Text fontSize="sm">
                                                                Reportes o datos que el sistema genera y le muestra al usuario 
                                                                (ej. una lista de ventas).
                                                            </Text>
                                                        </HStack>
                                                    </ListItem>
                                                    
                                                    <ListItem>
                                                        <HStack align="start">
                                                            <Badge colorScheme="purple" variant="outline">Consultas</Badge>
                                                            <Text fontSize="sm">
                                                                Búsquedas o vistas donde el usuario pide ver información sin cambiarla 
                                                                (ej. ver el detalle de un producto).
                                                            </Text>
                                                        </HStack>
                                                    </ListItem>
                                                    
                                                    <ListItem>
                                                        <HStack align="start">
                                                            <Badge colorScheme="orange" variant="outline">Archivos</Badge>
                                                            <Text fontSize="sm">
                                                                Las principales tablas o grupos de datos lógicos que el sistema guarda internamente 
                                                                (ej. la tabla de clientes).
                                                            </Text>
                                                        </HStack>
                                                    </ListItem>
                                                    
                                                    <ListItem>
                                                        <HStack align="start">
                                                            <Badge colorScheme="red" variant="outline">Interfaces</Badge>
                                                            <Text fontSize="sm">
                                                                Datos que se envían o se reciben desde otras aplicaciones externas.
                                                            </Text>
                                                        </HStack>
                                                    </ListItem>
                                                </UnorderedList>
                                            </Box>
                                        </VStack>
                                    </ListItem>

                                    <Divider />

                                    <ListItem>
                                        <VStack align="stretch" spacing={3}>
                                            <Text fontWeight="bold" color="gray.800">
                                                ⚖️ Asigna una Complejidad:
                                            </Text>
                                            <Text color="gray.700" ml={4}>
                                                Para cada función que contaste, decide si su complejidad es{" "}
                                                <Badge colorScheme="green" mx={1}>Baja</Badge>,{" "}
                                                <Badge colorScheme="yellow" mx={1}>Media</Badge> o{" "}
                                                <Badge colorScheme="red" mx={1}>Alta</Badge>.
                                            </Text>
                                            <Text fontSize="sm" color="gray.600" ml={4} fontStyle="italic">
                                                💡 La complejidad depende de la cantidad de datos o archivos que maneja cada función.
                                            </Text>
                                        </VStack>
                                    </ListItem>

                                    <Divider />

                                    <ListItem>
                                        <VStack align="stretch" spacing={3}>
                                            <Text fontWeight="bold" color="gray.800">
                                                ✖️ Multiplica por su Peso:
                                            </Text>
                                            <Text color="gray.700" ml={4}>
                                                Multiplica la cantidad de funciones de cada nivel de complejidad por su "peso" estándar 
                                                (un valor fijo que aparece en la columna "Weight").
                                            </Text>
                                        </VStack>
                                    </ListItem>

                                    <Divider />

                                    <ListItem>
                                        <VStack align="stretch" spacing={3}>
                                            <Text fontWeight="bold" color="gray.800">
                                                ➕ Suma Todo:
                                            </Text>
                                            <Text color="gray.700" ml={4}>
                                                Suma los totales que obtuviste en el paso anterior para encontrar el número final de{" "}
                                                <Badge colorScheme="green" variant="solid">Puntos de Función sin ajustar</Badge>.
                                            </Text>
                                        </VStack>
                                    </ListItem>
                                </OrderedList>
                            </Box>

                            <Box bg="green.50" p={4} borderRadius="md" borderLeft="4px" borderLeftColor="green.500">
                                <Text fontWeight="bold" color="green.800" mb={2}>
                                    🎯 Factor de Ajuste
                                </Text>
                                <Text color="green.700" fontSize="sm">
                                    El factor de ajuste (0.65 - 1.35) considera características técnicas del proyecto como 
                                    comunicación de datos, procesamiento distribuido, rendimiento, etc. Un valor de 1.0 es neutro.
                                </Text>
                            </Box>

                            <Box bg="yellow.50" p={4} borderRadius="md" borderLeft="4px" borderLeftColor="yellow.500">
                                <Text fontWeight="bold" color="yellow.800" mb={2}>
                                    💡 Consejo
                                </Text>
                                <Text color="yellow.700" fontSize="sm">
                                    Si es tu primera vez usando Function Points, comienza con funciones obviamente visibles al usuario 
                                    y usa complejidad "Media" como punto de partida hasta que ganes experiencia.
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button colorScheme="green" onClick={onClose}>
                            ¡Entendido!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default FunctionPointHelpModal;