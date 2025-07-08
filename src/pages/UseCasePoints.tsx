import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import {
    Box, Container, Text, FormControl, Input, Button, FormLabel,
    VStack, SimpleGrid, HStack, useDisclosure, Stack,
    Card, CardBody, CardHeader
} from "@chakra-ui/react";

// Importar cuando esté disponible
// import UseCasePointsHelpModal from '../components/usecasepoints/UseCasePointsHelpModal';

const UseCasePoints: React.FC = () => {
    const [simpleActors, setSimpleActors] = useState<string>('');
    const [averageActors, setAverageActors] = useState<string>('');
    const [complexActors, setComplexActors] = useState<string>('');

    const [simpleUseCases, setSimpleUseCases] = useState<string>('');
    const [averageUseCases, setAverageUseCases] = useState<string>('');
    const [complexUseCases, setComplexUseCases] = useState<string>('');

    const [tcfValues, setTcfValues] = useState<string[]>(Array(13).fill(''));
    const [ecfValues, setEcfValues] = useState<string[]>(Array(8).fill(''));

    const [ucp, setUcp] = useState<number | null>(null);
    const [effortHours, setEffortHours] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const resultSectionRef = useRef<HTMLDivElement>(null);
    const helpModal = useDisclosure();

    const TCF_FACTORS = [
        "Sistema Distribuido",
        "Desempeño",
        "Eficiencia del Usuario Final",
        "Complejidad del Procesamiento Interno",
        "Reusabilidad del Código",
        "Facilidad de Instalación",
        "Facilidad de Uso",
        "Portabilidad",
        "Facilidad de Cambio",
        "Concurrencia",
        "Características Especiales de Seguridad",
        "Acceso a Terceros",
        "Facilidades de Entrenamiento"
    ];

    const ECF_FACTORS = [
        "Familiaridad con Proceso Unificado",
        "Experiencia en Desarrollo de Aplicaciones",
        "Experiencia en Orientación a Objetos",
        "Capacidad del Jefe de Proyecto",
        "Motivación",
        "Estabilidad de los Requerimientos",
        "Personal a Tiempo Parcial",
        "Lenguaje de Programación Difícil"
    ];

    const handleTcfChange = (index: number, value: string) => {
        if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 5)) {
            const newTcfValues = [...tcfValues];
            newTcfValues[index] = value;
            setTcfValues(newTcfValues);
        }
    };

    const handleEcfChange = (index: number, value: string) => {
        if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 5)) {
            const newEcfValues = [...ecfValues];
            newEcfValues[index] = value;
            setEcfValues(newEcfValues);
        }
    };

    const handleActorChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
            setter(value);
        }
    };

    const handleUseCaseChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
            setter(value);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Simular delay para mostrar loading
            await new Promise(resolve => setTimeout(resolve, 500));

            const totalActorPoints = (Number(simpleActors) || 0) * 1 + 
                                   (Number(averageActors) || 0) * 2 + 
                                   (Number(complexActors) || 0) * 3;
            
            const totalUseCasePoints = (Number(simpleUseCases) || 0) * 5 + 
                                     (Number(averageUseCases) || 0) * 10 + 
                                     (Number(complexUseCases) || 0) * 15;

            const unadjustedUCP = totalActorPoints + totalUseCasePoints;

            // Cálculo de TCF
            const tcfWeights = [2, 1, 1, 1, 1, 0.5, 0.5, 2, 1, 1, 1, 1, 1];
            const tcf = 0.6 + (0.01 * tcfValues.reduce((sum, val, idx) => sum + ((Number(val) || 0) * tcfWeights[idx]), 0));

            // Cálculo de ECF
            const ecfWeights = [1.5, 0.5, 1, 0.5, 1, 2, -1, -1];
            const ecf = 1.4 + (-0.03 * ecfValues.reduce((sum, val, idx) => sum + ((Number(val) || 0) * ecfWeights[idx]), 0));

            const adjustedUCP = unadjustedUCP * tcf * ecf;
            setUcp(adjustedUCP);

            // Cálculo del esfuerzo
            const X = ecfValues.slice(0, 6).filter(val => (Number(val) || 0) < 3).length;
            const Y = ecfValues.slice(6, 8).filter(val => (Number(val) || 0) > 3).length;

            let effortPerUCP = 0;
            const sumXY = X + Y;

            if (sumXY <= 2) {
                effortPerUCP = 20;
            } else if (sumXY === 3 || sumXY === 4) {
                effortPerUCP = 28;
            } else if (sumXY >= 5) {
                effortPerUCP = 36;
            }

            const totalEffort = adjustedUCP * effortPerUCP;
            setEffortHours(totalEffort);

            // Scroll suave hacia resultados
            setTimeout(() => {
                resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error('Error calculating use case points:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="full">
            <Box pt={1} mx={2}>
                <HStack mb={1}>
                    <Text fontSize="xl">Use Case Points</Text>
                    <Button 
                        colorScheme='teal' 
                        variant='outline'
                        size='sm'
                        onClick={helpModal.onOpen}>
                        ?
                    </Button>
                </HStack>

                {/* Aquí irá el HelpModal cuando esté implementado */}
                {/* <UseCasePointsHelpModal isOpen={helpModal.isOpen} onClose={helpModal.onClose} /> */}

                <Container as="form" onSubmit={handleSubmit} maxW="full">
                    <VStack spacing={4} align="stretch">
                        
                        {/* Sección de Actores y Casos de Uso */}
                        <Card>
                            <CardHeader>
                                <Text fontWeight="bold">Actores y Casos de Uso</Text>
                            </CardHeader>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    <Box>
                                        <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">
                                            Actores
                                        </Text>
                                        <SimpleGrid columns={3} spacing={4}>
                                            <FormControl>
                                                <FormLabel fontSize="sm">Simples (1 pt)</FormLabel>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={simpleActors}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                        handleActorChange(setSimpleActors, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="sm">Promedio (2 pts)</FormLabel>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={averageActors}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                        handleActorChange(setAverageActors, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="sm">Complejos (3 pts)</FormLabel>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={complexActors}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                        handleActorChange(setComplexActors, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </FormControl>
                                        </SimpleGrid>
                                    </Box>

                                    <Box>
                                        <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">
                                            Casos de Uso
                                        </Text>
                                        <SimpleGrid columns={3} spacing={4}>
                                            <FormControl>
                                                <FormLabel fontSize="sm">Simples (5 pts)</FormLabel>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={simpleUseCases}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                        handleUseCaseChange(setSimpleUseCases, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="sm">Promedio (10 pts)</FormLabel>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={averageUseCases}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                        handleUseCaseChange(setAverageUseCases, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="sm">Complejos (15 pts)</FormLabel>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="999"
                                                    value={complexUseCases}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                        handleUseCaseChange(setComplexUseCases, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </FormControl>
                                        </SimpleGrid>
                                    </Box>
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        {/* Factor de Complejidad Técnica (TCF) */}
                        <Card>
                            <CardHeader>
                                <Text fontWeight="bold">Factor de Complejidad Técnica (TCF)</Text>
                                <Text fontSize="sm" color="gray.600">
                                    Evalúa del 0 al 5 cada factor técnico
                                </Text>
                            </CardHeader>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {TCF_FACTORS.map((factor, index) => (
                                        <FormControl key={index}>
                                            <FormLabel fontSize="sm">{factor}</FormLabel>
                                            <Input
                                                type="number"
                                                max={5}
                                                min={0}
                                                value={tcfValues[index]}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                    handleTcfChange(index, e.target.value)}
                                                placeholder="0"
                                            />
                                        </FormControl>
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        {/* Factor de Complejidad Ambiental (ECF) */}
                        <Card>
                            <CardHeader>
                                <Text fontWeight="bold">Factor de Complejidad Ambiental (ECF)</Text>
                                <Text fontSize="sm" color="gray.600">
                                    Evalúa del 0 al 5 cada factor ambiental
                                </Text>
                            </CardHeader>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {ECF_FACTORS.map((factor, index) => (
                                        <FormControl key={index}>
                                            <FormLabel fontSize="sm">{factor}</FormLabel>
                                            <Input
                                                type="number"
                                                max={5}
                                                min={0}
                                                value={ecfValues[index]}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                    handleEcfChange(index, e.target.value)}
                                                placeholder="0"
                                            />
                                        </FormControl>
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        <Button 
                            type="submit" 
                            colorScheme="green" 
                            size="lg"
                            isLoading={loading}
                            loadingText="Calculando..."
                        >
                            Calcular Puntos de Caso de Uso
                        </Button>
                    </VStack>
                </Container>

                {(ucp !== null || effortHours !== null) && (
                    <Box mt={6} ref={resultSectionRef}>
                        <Text fontSize="xl" mb={4}>Resultados de la Estimación</Text>
                        <Card>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <Stack direction={["column", "row"]} spacing={4}>
                                        <FormControl>
                                            <FormLabel>Puntos de Caso de Uso (UCP)</FormLabel>
                                            <HStack>
                                                <Text fontSize="lg" fontWeight="bold" color="green.600">
                                                    {ucp?.toFixed(2)}
                                                </Text>
                                                <Text fontStyle="italic" color="gray.600">UCP</Text>
                                            </HStack>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Esfuerzo Estimado (ESF)</FormLabel>
                                            <HStack>
                                                <Text fontSize="lg" fontWeight="bold">
                                                    {effortHours?.toFixed(2)}
                                                </Text>
                                                <Text fontStyle="italic" color="gray.600">Horas</Text>
                                            </HStack>
                                        </FormControl>
                                    </Stack>
                                    
                                    <Box mt={4} p={4} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
                                        <Text fontWeight="bold" color="green.800" mb={2}>
                                            Resumen
                                        </Text>
                                        <Text color="green.700">
                                            El proyecto tiene un tamaño estimado de {ucp?.toFixed(2)} puntos de caso de uso, 
                                            lo que equivale a aproximadamente {effortHours?.toFixed(2)} horas de desarrollo 
                                            ({(effortHours! / 160).toFixed(2)} personas-mes aproximadamente).
                                        </Text>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default UseCasePoints;