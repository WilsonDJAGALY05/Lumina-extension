'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiStar, FiShare2, FiDownload, FiUpload, FiGitBranch } from 'react-icons/fi';

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  versions: TemplateVersion[];
  lastBackup: string;
}

interface TemplateVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  author: string;
  changes: string;
}

interface Backup {
  id: string;
  templates: Template[];
  createdAt: string;
  size: number;
}

export const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Charger les templates et backups au démarrage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('templates');
    const savedBackups = localStorage.getItem('templateBackups');
    
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    
    if (savedBackups) {
      setBackups(JSON.parse(savedBackups));
    }
  }, []);

  // Sauvegarder les templates et backups
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem('templates', JSON.stringify(templates));
    }
    if (backups.length > 0) {
      localStorage.setItem('templateBackups', JSON.stringify(backups));
    }
  }, [templates, backups]);

  // Backup automatique toutes les heures
  useEffect(() => {
    const backupInterval = setInterval(() => {
      createBackup();
    }, 3600000); // 1 heure

    return () => clearInterval(backupInterval);
  }, [templates]);

  const createBackup = () => {
    const newBackup: Backup = {
      id: Date.now().toString(),
      templates: templates,
      createdAt: new Date().toISOString(),
      size: JSON.stringify(templates).length,
    };

    setBackups(prev => [...prev, newBackup].slice(-10)); // Garder les 10 derniers backups
    toast({
      title: 'Backup automatique créé',
      description: 'Vos templates ont été sauvegardés',
      status: 'success',
      duration: 2000,
    });
  };

  const restoreFromBackup = (backup: Backup) => {
    setTemplates(backup.templates);
    toast({
      title: 'Backup restauré',
      description: 'Vos templates ont été restaurés',
      status: 'success',
      duration: 2000,
    });
  };

  const createVersion = (template: Template, changes: string) => {
    const newVersion: TemplateVersion = {
      id: Date.now().toString(),
      version: template.versions.length + 1,
      content: template.content,
      createdAt: new Date().toISOString(),
      author: 'Utilisateur', // À remplacer par l'utilisateur connecté
      changes,
    };

    const updatedTemplate = {
      ...template,
      versions: [...template.versions, newVersion],
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev =>
      prev.map(t => (t.id === template.id ? updatedTemplate : t))
    );

    toast({
      title: 'Nouvelle version créée',
      description: `Version ${newVersion.version} créée avec succès`,
      status: 'success',
      duration: 2000,
    });
  };

  const saveTemplate = (template: Template) => {
    setTemplates(prev =>
      prev.map(t => (t.id === template.id ? template : t))
    );
    createVersion(template, 'Mise à jour du template');
    toast({
      title: 'Template sauvegardé',
      description: 'Les modifications ont été enregistrées',
      status: 'success',
      duration: 2000,
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: 'Template supprimé',
      description: 'Le template a été supprimé avec succès',
      status: 'success',
      duration: 2000,
    });
  };

  const toggleFavorite = (id: string) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  const shareTemplate = (template: Template) => {
    // Implémentation du partage
    toast({
      title: 'Template partagé',
      description: 'Le template a été partagé avec succès',
      status: 'success',
      duration: 2000,
    });
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={6} borderRadius="lg" boxShadow="xl" bg={bgColor}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Gestionnaire de Templates</Text>
          <HStack>
            <Button
              leftIcon={<FiDownload />}
              onClick={createBackup}
              colorScheme="blue"
              variant="outline"
            >
              Backup Manuel
            </Button>
            <Menu>
              <MenuButton as={Button} leftIcon={<FiUpload />}>
                Restaurer
              </MenuButton>
              <MenuList>
                {backups.map(backup => (
                  <MenuItem
                    key={backup.id}
                    onClick={() => restoreFromBackup(backup)}
                  >
                    Backup du {new Date(backup.createdAt).toLocaleString()}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </HStack>

        <Input
          placeholder="Rechercher un template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Catégorie</Th>
              <Th>Dernière modification</Th>
              <Th>Versions</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTemplates.map(template => (
              <Tr key={template.id}>
                <Td>
                  <HStack>
                    <Text>{template.name}</Text>
                    {template.isFavorite && (
                      <Badge colorScheme="yellow">Favori</Badge>
                    )}
                  </HStack>
                </Td>
                <Td>{template.category}</Td>
                <Td>{new Date(template.updatedAt).toLocaleString()}</Td>
                <Td>
                  <Badge colorScheme="blue">
                    v{template.versions.length}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Tooltip label="Éditer">
                      <IconButton
                        aria-label="Éditer"
                        icon={<FiEdit2 />}
                        onClick={() => {
                          setSelectedTemplate(template);
                          onOpen();
                        }}
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Versions">
                      <IconButton
                        aria-label="Versions"
                        icon={<FiGitBranch />}
                        onClick={() => {
                          // Afficher l'historique des versions
                        }}
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Favori">
                      <IconButton
                        aria-label="Favori"
                        icon={<FiStar />}
                        onClick={() => toggleFavorite(template.id)}
                        size="sm"
                        colorScheme={template.isFavorite ? 'yellow' : 'gray'}
                      />
                    </Tooltip>
                    <Tooltip label="Partager">
                      <IconButton
                        aria-label="Partager"
                        icon={<FiShare2 />}
                        onClick={() => shareTemplate(template)}
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Supprimer">
                      <IconButton
                        aria-label="Supprimer"
                        icon={<FiTrash2 />}
                        onClick={() => deleteTemplate(template.id)}
                        size="sm"
                        colorScheme="red"
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Éditer le Template</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedTemplate && (
                <VStack spacing={4} align="stretch">
                  <Input
                    value={selectedTemplate.name}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        name: e.target.value,
                      })
                    }
                    placeholder="Nom du template"
                  />
                  <Select
                    value={selectedTemplate.category}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="professionnel">Professionnel</option>
                    <option value="personnel">Personnel</option>
                    <option value="marketing">Marketing</option>
                  </Select>
                  <Button
                    onClick={() => {
                      saveTemplate(selectedTemplate);
                      onClose();
                    }}
                    colorScheme="blue"
                  >
                    Sauvegarder
                  </Button>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {backups.length > 0 && (
          <Badge colorScheme="green" p={2} borderRadius="md">
            {backups.length} backups disponibles
          </Badge>
        )}
      </VStack>
    </Box>
  );
}; 