'use client'

import React from 'react'
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

export function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2024 Lumina. Tous droits réservés</Text>
        <Stack direction={'row'} spacing={6}>
          <Text>Politique de confidentialité</Text>
          <Text>Conditions d'utilisation</Text>
          <Text>Contact</Text>
        </Stack>
      </Container>
    </Box>
  )
} 