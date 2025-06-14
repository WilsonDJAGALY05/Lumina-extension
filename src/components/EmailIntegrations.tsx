'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  Icon,
  useColorMode,
  Badge,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FiMail, FiCalendar, FiFileText, FiSettings } from 'react-icons/fi';

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  isConnected: boolean;
  type: 'email' | 'calendar' | 'docs';
}

export const EmailIntegrations: React.FC = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();

  const integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: FiMail,
      isConnected: false,
      type: 'email',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: FiMail,
      isConnected: false,
      type: 'email',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: FiCalendar,
      isConnected: false,
      type: 'calendar',
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      icon: FiFileText,
      isConnected: false,
      type: 'docs',
    },
  ];

  const handleConnect = (integration: Integration) => {
    // Simulation de connexion OAuth
    toast({
      title: 'Connexion en cours',
      description: `Connexion à ${integration.name}...`,
      status: 'info',
      duration: 2000,
    });

    // Simuler un délai de connexion
    setTimeout(() => {
      toast({
        title: 'Connecté',
        description: `Connexion à ${integration.name} réussie !`,
        status: 'success',
        duration: 3000,
      });
    }, 2000);
  };

  return (
    <Box p={6} borderRadius="lg" boxShadow="xl" bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Intégrations</Text>
          <Button
            leftIcon={<FiSettings />}
            variant="ghost"
            onClick={onToggle}
          >
            {isOpen ? 'Réduire' : 'Voir les options'}
          </Button>
        </HStack>

        <Collapse in={isOpen}>
          <VStack spacing={4} align="stretch">
            {integrations.map((integration) => (
              <Box
                key={integration.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ shadow: 'md' }}
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={integration.icon} boxSize={6} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{integration.name}</Text>
                      <Badge
                        colorScheme={integration.isConnected ? 'green' : 'gray'}
                        variant="subtle"
                      >
                        {integration.isConnected ? 'Connecté' : 'Non connecté'}
                      </Badge>
                    </VStack>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme={integration.isConnected ? 'red' : 'blue'}
                    onClick={() => handleConnect(integration)}
                  >
                    {integration.isConnected ? 'Déconnecter' : 'Connecter'}
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Collapse>

        <Text fontSize="sm" color="gray.500">
          Connectez vos services pour une expérience optimale
        </Text>
      </VStack>
    </Box>
  );
}; 