import React from 'react'
import { Button, Icon, IButtonProps } from 'native-base'
import { Feather, Foundation } from '@expo/vector-icons'

interface Props extends IButtonProps {
  active: boolean
  icon: string
  children: React.ReactNode
  iconGroup?: string
}

const ICON_GROUPS = {
  'Feather': Feather,
  'Foundation': Foundation
}
const MenuButton = ({ active, icon, children, iconGroup='Feather', ...props }: Props) => {
  return (
    <Button
      size="lg"
      _light={{
        colorScheme: 'blue',
        _pressed: {
          bg: 'primary.100'
        },
        _text: {
          color: active ? 'blue.50' : 'blue.500'
        }
      }}
      _dark={{
        colorScheme: 'darkBlue',
        _pressed: {
          bg: 'primary.600'
        },
        _text: {
          color: active ? 'blue.50' : undefined
        }
      }}
      bg={active ? undefined : 'transparent'}
      variant="solid"
      justifyContent="flex-start"
      leftIcon={<Icon as={ICON_GROUPS[iconGroup]} name={icon} size="sm" opacity={0.5} />}
      {...props}
    >
      {children}
    </Button>
  )
}

export default MenuButton
