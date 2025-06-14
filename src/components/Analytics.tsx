'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Progress,
  useColorMode,
} from '@chakra-ui/react';

interface AnalyticsData {
  totalEmails: number;
  timeSaved: number;
  templatesCreated: number;
  averageLength: number;
  mostUsedTone: string;
  satisfactionRate: number;
}

export const Analytics: React.FC = () => {
  const { colorMode } = useColorMode();
  
  // Données fictives pour la démonstration
  const analyticsData: AnalyticsData = {
    totalEmails: 150,
    timeSaved: 25, // en heures
    templatesCreated: 12,
    averageLength: 250, // en caractères
    mostUsedTone: 'Professionnel',
    satisfactionRate: 0.85,
  };

  return (
    <Box p={6} borderRadius="lg" boxShadow="xl" bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Analytics</Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Stat>
            <StatLabel>Emails générés</StatLabel>
            <StatNumber>{analyticsData.totalEmails}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Temps économisé</StatLabel>
            <StatNumber>{analyticsData.timeSaved}h</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              15.05%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Templates créés</StatLabel>
            <StatNumber>{analyticsData.templatesCreated}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              8.14%
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box>
          <Text mb={2}>Taux de satisfaction</Text>
          <Progress
            value={analyticsData.satisfactionRate * 100}
            colorScheme="green"
            borderRadius="full"
          />
          <Text mt={2} fontSize="sm" color="gray.500">
            {analyticsData.satisfactionRate * 100}% des utilisateurs satisfaits
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Text fontWeight="bold" mb={2}>Ton le plus utilisé</Text>
            <Text>{analyticsData.mostUsedTone}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>Longueur moyenne</Text>
            <Text>{analyticsData.averageLength} caractères</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}; 