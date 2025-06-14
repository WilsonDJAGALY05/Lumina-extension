'use client'

import React from 'react'
import { Box, Container, VStack, useColorMode } from '@chakra-ui/react'
import { EmailGenerator } from '../components/EmailGenerator'
import { TemplateManager } from '../components/TemplateManager'
import { Analytics } from '../components/Analytics'
import { EmailIntegrations } from '../components/EmailIntegrations'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export default function Home() {
  const { colorMode } = useColorMode()

  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <EmailGenerator onGenerate={(email) => console.log(email)} />
          <TemplateManager />
          <Analytics />
          <EmailIntegrations />
        </VStack>
      </Container>
      <Footer />
    </Box>
  )
} 