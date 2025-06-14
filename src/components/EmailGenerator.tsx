'use client'

import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Select,
  useToast,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  useColorModeValue,
  Card,
  CardBody,
  Heading,
  IconButton,
  Tooltip,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Badge,
  Collapse,
  useDisclosure,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { FiSettings, FiSave, FiShare2, FiClock, FiStar, FiLock, FiRefreshCw } from 'react-icons/fi'

interface Template {
  id: string
  content: string
  tone: string
  length: string
  createdAt: Date
}

type EmailTone = 'professionnel' | 'amical' | 'formel' | 'persuasif' | 'storytelling' | 'synthétique'
type EmailLength = 'court' | 'moyen' | 'long'
type Language = 'fr' | 'en' | 'es' | 'de'
type AIModel = 'openai' | 'ollama' | 'huggingface'
type WritingStyle = 'direct' | 'narratif' | 'argumentatif' | 'descriptif'

interface CacheEntry {
  id: string
  context: string
  tone: EmailTone
  length: EmailLength
  model: AIModel
  formality: number
  creativity: number
  writingStyle: WritingStyle
  language: Language
  maxTokens: number
  temperature: number
  result: string
  timestamp: number
}

interface EmailGeneratorProps {
  onGenerate: (email: string) => void
}

export const EmailGenerator: React.FC<EmailGeneratorProps> = ({ onGenerate }) => {
  const [context, setContext] = useState('')
  const [tone, setTone] = useState<EmailTone>('professionnel')
  const [length, setLength] = useState<EmailLength>('moyen')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai')
  const [formality, setFormality] = useState(0.5)
  const [creativity, setCreativity] = useState(0.7)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [writingStyle, setWritingStyle] = useState<WritingStyle>('direct')
  const [language, setLanguage] = useState<Language>('fr')
  const [maxTokens, setMaxTokens] = useState(500)
  const [temperature, setTemperature] = useState(0.7)
  const [cache, setCache] = useState<CacheEntry[]>([])
  const { isOpen, onToggle } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const savedCache = localStorage.getItem('emailCache')
    if (savedCache) {
      setCache(JSON.parse(savedCache))
    }
  }, [])

  useEffect(() => {
    if (cache.length > 0) {
      localStorage.setItem('emailCache', JSON.stringify(cache))
    }
  }, [cache])

  const checkCache = useCallback(() => {
    const cacheKey = JSON.stringify({
      context,
      tone,
      length,
      model: selectedModel,
      formality,
      creativity,
      writingStyle,
      language,
      maxTokens,
      temperature,
    })

    const cachedResult = cache.find(entry => 
      JSON.stringify({
        context: entry.context,
        tone: entry.tone,
        length: entry.length,
        model: entry.model,
        formality: entry.formality,
        creativity: entry.creativity,
        writingStyle: entry.writingStyle,
        language: entry.language,
        maxTokens: entry.maxTokens,
        temperature: entry.temperature,
      }) === cacheKey
    )

    if (cachedResult) {
      toast({
        title: 'Résultat trouvé dans le cache',
        description: 'Utilisation d\'un résultat précédent',
        status: 'info',
        duration: 2000,
      })
      onGenerate(cachedResult.result)
      return true
    }
    return false
  }, [context, tone, length, selectedModel, formality, creativity, writingStyle, language, maxTokens, temperature, cache, onGenerate, toast])

  const handleGenerate = useCallback(async () => {
    if (!context.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un contexte pour l\'email',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (checkCache()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          tone,
          length,
          model: selectedModel,
          formality,
          creativity,
          isAnonymous,
          writingStyle,
          language,
          maxTokens,
          temperature,
        }),
      })

      if (!response.ok) throw new Error('Erreur de génération')

      const data = await response.json()
      
      const newCacheEntry: CacheEntry = {
        id: Date.now().toString(),
        context,
        tone,
        length,
        model: selectedModel,
        formality,
        creativity,
        writingStyle,
        language,
        maxTokens,
        temperature,
        result: data.email,
        timestamp: Date.now(),
      }

      setCache(prev => [...prev, newCacheEntry].slice(-50))
      
      onGenerate(data.email)
      
      toast({
        title: 'Succès',
        description: 'Email généré avec succès',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la génération de l\'email',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }, [context, tone, length, selectedModel, formality, creativity, isAnonymous, writingStyle, language, maxTokens, temperature, onGenerate, toast, checkCache])

  const clearCache = () => {
    setCache([])
    localStorage.removeItem('emailCache')
    toast({
      title: 'Cache vidé',
      description: 'Le cache a été réinitialisé',
      status: 'info',
      duration: 2000,
    })
  }

  return (
    <Box p={6} borderRadius="lg" boxShadow="xl" bg={bgColor}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Générateur d'Email IA</Text>
          <HStack>
            <IconButton
              aria-label="Paramètres avancés"
              icon={<FiSettings />}
              onClick={onToggle}
              variant="ghost"
            />
            <IconButton
              aria-label="Mode sombre"
              icon={<FiLock />}
              onClick={toggleColorMode}
              variant="ghost"
            />
            <Tooltip label="Vider le cache">
              <IconButton
                aria-label="Vider le cache"
                icon={<FiRefreshCw />}
                onClick={clearCache}
                variant="ghost"
              />
            </Tooltip>
          </HStack>
        </HStack>

        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Décrivez le contexte de votre email..."
          size="lg"
          minH="150px"
        />

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Paramètres de base</Tab>
            <Tab>Paramètres avancés</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4}>
                <HStack spacing={4} width="100%">
                  <Select value={tone} onChange={(e) => setTone(e.target.value as EmailTone)}>
                    <option value="professionnel">Professionnel</option>
                    <option value="amical">Amical</option>
                    <option value="formel">Formel</option>
                    <option value="persuasif">Persuasif</option>
                    <option value="storytelling">Storytelling</option>
                    <option value="synthétique">Synthétique</option>
                  </Select>

                  <Select value={length} onChange={(e) => setLength(e.target.value as EmailLength)}>
                    <option value="court">Court</option>
                    <option value="moyen">Moyen</option>
                    <option value="long">Long</option>
                  </Select>

                  <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as AIModel)}>
                    <option value="openai">OpenAI</option>
                    <option value="ollama">Ollama</option>
                    <option value="huggingface">HuggingFace</option>
                  </Select>
                </HStack>

                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Niveau de formalité</FormLabel>
                    <Slider value={formality} onChange={setFormality} min={0} max={1} step={0.1}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Créativité</FormLabel>
                    <Slider value={creativity} onChange={setCreativity} min={0} max={1} step={0.1}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                </HStack>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Style d'écriture</FormLabel>
                  <RadioGroup value={writingStyle} onChange={(value) => setWritingStyle(value as WritingStyle)}>
                    <HStack spacing={4}>
                      <Radio value="direct">Direct</Radio>
                      <Radio value="narratif">Narratif</Radio>
                      <Radio value="argumentatif">Argumentatif</Radio>
                      <Radio value="descriptif">Descriptif</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Langue</FormLabel>
                  <Select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </Select>
                </FormControl>

                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Nombre maximum de tokens</FormLabel>
                    <NumberInput
                      value={maxTokens}
                      onChange={(_, value) => setMaxTokens(value)}
                      min={100}
                      max={2000}
                      step={100}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Température</FormLabel>
                    <Slider value={temperature} onChange={setTemperature} min={0} max={1} step={0.1}>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                </HStack>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Mode anonyme</FormLabel>
                  <Switch isChecked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                </FormControl>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <HStack spacing={4}>
          <Button
            colorScheme="blue"
            onClick={handleGenerate}
            isLoading={isLoading}
            loadingText="Génération..."
            size="lg"
            flex={1}
          >
            Générer l'email
          </Button>
          
          <Menu>
            <MenuButton as={IconButton} icon={<FiSave />} variant="ghost" />
            <MenuList>
              <MenuItem icon={<FiStar />}>Sauvegarder comme favori</MenuItem>
              <MenuItem icon={<FiShare2 />}>Partager</MenuItem>
              <MenuItem icon={<FiClock />}>Historique</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {isAnonymous && (
          <Badge colorScheme="green" p={2} borderRadius="md">
            Mode anonyme activé - Aucune donnée ne sera stockée
          </Badge>
        )}

        {cache.length > 0 && (
          <Badge colorScheme="blue" p={2} borderRadius="md">
            {cache.length} résultats en cache
          </Badge>
        )}
      </VStack>
    </Box>
  )
}

function getMostUsedTone(templates: Template[]): string {
  const tones = templates.map(t => t.tone)
  const counts = tones.reduce((acc, tone) => {
    acc[tone] = (acc[tone] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
}

function getAverageLength(templates: Template[]): string {
  if (templates.length === 0) return 'N/A'
  const lengths = templates.map(t => t.content.length)
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length
  if (avg < 100) return 'Court'
  if (avg < 300) return 'Moyen'
  return 'Long'
} 