import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import {
    Box, Container, Text, FormControl, Input, Button, FormLabel,
    VStack, Stack, Switch, useDisclosure,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    HStack,
    SimpleGrid,
    Card,
    CardBody,
    CardHeader,
} from "@chakra-ui/react";

import { CocomoTwoOut, CocomoTwoForm } from '../client/models';
import { MethodsService } from '../client/services';
import CostDriver from '../components/common/CostDriver';
import CpmModal from '../components/cocomo/CpmModal';
import { StagePercentages } from '../client/models';

import HelpModal from '../components/cocomoTwo/helpModal';
import EquationsModal from '../components/cocomo/EquationsModal';

const CocomoTwo = () => {
    const [formData, setFormData] = useState<CocomoTwoForm>({
        kdlc: 0,
        cpm: 0,
        costDrivers: [],
        scaleDrivers: [3.72, 3.04, 4.24, 3.29, 4.68] // Valores nominales por defecto
    });
    const [loading, setLoading] = useState(false);
    const [selectedCostDrivers, setSelectedCostDrivers] = useState<{ [key: string]: string }>({});
    const [selectedScaleDrivers, setSelectedScaleDrivers] = useState<{ [key: string]: string }>({});
    const [estimationResult, setEstimationResult] = useState<CocomoTwoOut | null>(null);

    const [isStagesEnabled, setIsStagesEnabled] = useState(false);
    const [showStageResults, setShowStageResults] = useState(false);
    const resultSectionRef = useRef<HTMLDivElement>(null);

    const cpmModal = useDisclosure();
    const helpModal = useDisclosure();
    const equationModal = useDisclosure();

    const [stagePercentages, setStagePercentages] = useState<StagePercentages>({
        requirements: 0,
        analysis: 0,
        design: 0,
        development: 0,
        testing: 0
    });

    const scaleDrivers = {
        'Scale Drivers': {
            PREC: { VL: 6.2, L: 4.96, N: 3.72, H: 2.48, VH: 1.24, EH: 0.0 },
            FLEX: { VL: 5.07, L: 4.05, N: 3.04, H: 2.03, VH: 1.01, EH: 0.0 },
            RESL: { VL: 7.07, L: 5.65, N: 4.24, H: 2.83, VH: 1.41, EH: 0.0 },
            TEAM: { VL: 5.48, L: 4.38, N: 3.29, H: 2.19, VH: 1.1, EH: 0.0 },
            PMAT: { VL: 7.8, L: 6.24, N: 4.68, H: 3.12, VH: 1.56, EH: 0.0 },
        },
    };    

    const costDrivers = {
        PRODUCT: {
            RSS: { VL: 0.82, L: 0.92, N: 1.00, H: 1.10, VH: 1.26, EH: null },
            TBD: { VL: null, L: 0.90, N: 1.00, H: 1.14, VH: 1.28, EH: null },
            CPR: { VL: 0.73, L: 0.87, N: 1.00, H: 1.17, VH: 1.34, EH: 1.74 },
            RUSE: { VL: null, L: 0.95, N: 1.00, H: 1.07, VH: 1.15, EH: 1.24 },
            DOC: { VL: 0.81, L: 0.91, N: 1.00, H: 1.11, VH: 1.23, EH: null },
        },
        PERSONAL: {
            CAN: { VL: 1.42, L: 1.19, N: 1.00, H: 0.85, VH: 0.71, EH: null },
            EAPL: { VL: 1.22, L: 1.10, N: 1.00, H: 0.88, VH: 0.81, EH: null },
            CPRO: { VL: 1.34, L: 1.15, N: 1.00, H: 0.88, VH: 0.76, EH: null },
            CPER: { VL: 1.29, L: 1.12, N: 1.00, H: 0.90, VH: 0.81, EH: null },
            EPLA: { VL: 1.19, L: 1.09, N: 1.00, H: 0.91, VH: 0.85, EH: null },
            ELP: { VL: 1.20, L: 1.09, N: 1.00, H: 0.91, VH: 0.84, EH: null },
        },
        PLATAFORMA: {
            RTE: { VL: null, L: null, N: 1.00, H: 1.11, VH: 1.29, EH: 1.63 },
            RMP: { VL: null, L: null, N: 1.00, H: 1.05, VH: 1.17, EH: 1.46 },
            VMC: { VL: null, L: 0.87, N: 1.00, H: 1.15, VH: 1.30, EH: null },
        },
        PROJECT: {
            UHS: { VL: 1.17, L: 1.09, N: 1.00, H: 0.90, VH: 0.78, EH: null },
            RPL: { VL: 1.43, L: 1.14, N: 1.00, H: null, VH: null, EH: null },
            DMS: { VL: 1.22, L: 1.09, N: 1.00, H: 0.93, VH: 0.86, EH: 0.80 },
        },
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;
        const parsedValue = id === 'mode' ? value : parseFloat(value);
        setFormData((prevData) => ({ ...prevData, [id]: parsedValue }));
    };

    const handleCostDriverChange = (option: string, value: string) => {
        setSelectedCostDrivers((prev) => {
            const updatedCostDrivers = { ...prev, [option]: value };
            const selectedValuesArray = Object.values(updatedCostDrivers).map(Number);
            setFormData((prevData) => ({
                ...prevData,
                costDrivers: selectedValuesArray,
            }));
            return updatedCostDrivers;
        });
    };

    const handleScaleDriverChange = (option: string, value: string) => {
        setSelectedScaleDrivers((prev) => {
            const updatedScaleDrivers = { ...prev, [option]: value };
            const selectedValuesArray = Object.values(updatedScaleDrivers).map(Number);
            setFormData((prevData) => ({
                ...prevData,
                scaleDrivers: selectedValuesArray,
            }));
            return updatedScaleDrivers;
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const result = MethodsService.cocomoTwo(formData);
            setEstimationResult(result);
            console.log(result);
            console.log('Selected Cost Drivers Array:', formData.costDrivers);
            console.log('Selected Scale Drivers Array:', formData.scaleDrivers);
             
            // Deslizamiento suave hacia la sección de resultados
            setTimeout(() => {
                resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchChange = () => {
        if (isStagesEnabled) {
            setShowStageResults(false);
            setStagePercentages({
                requirements: 0,
                analysis: 0,
                design: 0,
                development: 0,
                testing: 0
            });
        } else {
            cpmModal.onOpen();
        }
        setIsStagesEnabled(!isStagesEnabled);
    };

    const handleCpmCalculation = (total: number, percentages: StagePercentages) => {
        console.log('Percentages received:', percentages);
        setFormData((prevData) => ({
            ...prevData,
            cpm: total,
        }));
        setStagePercentages(percentages);
        setShowStageResults(true); 
    };

    const handleModalSubmit = () => {
        setIsStagesEnabled(false);
    };

    return (
        <Container maxW="full">
            <Box pt={1} mx={2}>
                <HStack mb={1}>
                    <Text fontSize="xl">COCOMO II</Text>
                    <Button 
                        colorScheme='teal' 
                        variant='outline'
                        size='sm'
                        onClick={helpModal.onOpen}>
                        ?
                    </Button>
                </HStack>
                
                <HelpModal isOpen={helpModal.isOpen} onClose={helpModal.onClose}/>

                <Container as="form" onSubmit={handleSubmit} maxW="full">
                    <VStack spacing={4} align="stretch">
                        
                        {/* Configuration Section */}
                        <Card>
                            <CardBody>
                                <Stack direction={['column', 'row']} spacing={4} align="center">
                                    <FormControl id="kdlc" isRequired>
                                        <FormLabel>KDLC</FormLabel>
                                        <Input
                                            id="kdlc"
                                            placeholder="KDLC"
                                            type="number"
                                            value={formData.kdlc}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl id="cpm" isRequired>
                                        <FormLabel>CPM</FormLabel>
                                        <Input
                                            id="cpm"
                                            placeholder="CPM"
                                            type="number"
                                            value={formData.cpm}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Etapas?</FormLabel>
                                        <Switch 
                                            id='stages' 
                                            onChange={handleSwitchChange} 
                                            isChecked={isStagesEnabled}
                                            colorScheme="green"
                                        />
                                    </FormControl>
                                </Stack>
                            </CardBody>
                        </Card>

                        {/* Cost Drivers Section */}
                        <Card>
                            <CardHeader>
                                <Text fontWeight="bold">Cost Drivers</Text>
                            </CardHeader>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {Object.entries(costDrivers).map(([label, options]) => (
                                        <CostDriver
                                            key={label}
                                            label={label}
                                            options={options}
                                            selectedValues={selectedCostDrivers}
                                            onChange={handleCostDriverChange}
                                        />
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        {/* Scale Drivers Section */}
                        <Card>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                                    {Object.entries(scaleDrivers).map(([label, options]) => (
                                        <CostDriver
                                            key={label}
                                            label={label}
                                            options={options}
                                            selectedValues={selectedScaleDrivers}
                                            onChange={handleScaleDriverChange}
                                        />
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        <Button 
                            variant="solid" 
                            type="submit" 
                            isLoading={loading} 
                            colorScheme="green"
                            size="lg"
                            loadingText="Calculando..."
                        >
                            Calcular Estimación
                        </Button>
                    </VStack>
                </Container>

                <CpmModal
                    isOpen={cpmModal.isOpen}
                    onClose={cpmModal.onClose}
                    onCalculate={handleCpmCalculation}
                    onSubmit={handleModalSubmit}
                />

                {estimationResult && (
                    <Box mt={6} ref={resultSectionRef}>
                        <HStack mb={4}>
                            <Text fontSize="xl">Ecuaciones</Text>
                            <Button 
                                colorScheme='teal' 
                                variant='outline'
                                size='sm'
                                onClick={equationModal.onOpen}>
                                ?
                            </Button>
                        </HStack>
                        <EquationsModal isOpen={equationModal.isOpen} onClose={equationModal.onClose} mode={'COCOMO-II'} />

                        <Text fontSize="xl" mb={4}>Resultados de la Estimación</Text>
                        <Card>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <Stack direction={["column", "row"]} spacing={4}>
                                        <FormControl id="esf">
                                            <FormLabel>ESF</FormLabel>
                                            <HStack>
                                                <Text fontSize="lg" fontWeight="bold">
                                                    {estimationResult.esf.toFixed(2)}
                                                </Text>
                                                <Text fontStyle="italic" color="gray.600">Personas-Mes</Text>
                                            </HStack>
                                        </FormControl>
                                        <FormControl id="tdes">
                                            <FormLabel>TDES</FormLabel>
                                            <HStack>
                                                <Text fontSize="lg" fontWeight="bold">
                                                    {estimationResult.tdes.toFixed(2)}
                                                </Text>
                                                <Text fontStyle="italic" color="gray.600">Meses</Text>
                                            </HStack>
                                        </FormControl>
                                    </Stack>
                                    <Stack direction={["column", "row"]} spacing={4}>
                                        <FormControl id="n">
                                            <FormLabel>Trabajadores</FormLabel>
                                            <HStack>
                                                <Text fontSize="lg" fontWeight="bold">
                                                    {estimationResult.n.toFixed(2)}
                                                </Text>
                                                <Text fontStyle="italic" color="gray.600">Personas</Text>
                                            </HStack>
                                        </FormControl>
                                        <FormControl id="productividad">
                                            <FormLabel>Productividad</FormLabel>
                                            <HStack>
                                                <Text fontSize="lg" fontWeight="bold">
                                                    {estimationResult.productividad.toFixed(2)}
                                                </Text>
                                                <Text fontStyle="italic" color="gray.600">KLDC/Personas-Mes</Text>
                                            </HStack>
                                        </FormControl>
                                    </Stack>
                                    <FormControl id="costo">
                                        <FormLabel>Costo Total</FormLabel>
                                        <HStack>
                                            <Text fontSize="lg" fontWeight="bold" color="green.600">
                                                {estimationResult.costo.toFixed(2)}
                                            </Text>
                                            <Text fontStyle="italic" color="gray.600">Soles</Text>
                                        </HStack>
                                    </FormControl>
                                    
                                    {(isStagesEnabled || showStageResults) && (
                                        <>
                                            <Text mt={4} fontSize="sm" color="gray.600">
                                                Nota: Los costos de etapa son válidos solo para la suma de porcentajes = 100%, 
                                                de lo contrario arrojará resultados inconsistentes.
                                            </Text>
                                            <Tabs variant='soft-rounded' colorScheme='green' isFitted>
                                                <TabList>
                                                    <Tab>Req</Tab>
                                                    <Tab>Ana</Tab>
                                                    <Tab>Des</Tab>
                                                    <Tab>Dev</Tab>
                                                    <Tab>Test</Tab>
                                                </TabList>
                                                <TabPanels>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.requirements).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.analysis).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.design).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.development).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.testing).toFixed(2)}</TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default CocomoTwo;