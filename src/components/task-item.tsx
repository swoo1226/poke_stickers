import React, {useCallback} from 'react'
import { PanGestureHandlerProps } from 'react-native-gesture-handler'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { Box, useTheme, themeTools, useColorModeValue, Pressable, HStack, Icon, Input, useToken } from 'native-base'
import SwipableView from './swipable-view'
import { Feather } from '@expo/vector-icons'
import type {TaskItemData} from '../screens/main-screen'

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
    isEditing: boolean
    isDone: boolean
    onPressLabel?: () => void
    onRemove?: (id: string) => void
    // onChangeSubject?: (subject: string) => void
    onChangeSubject?: (id: string, newSubject: string) => void
    onFinishEditing?: () => void
    subject: string
    onChangeText?: () => void
    id: string
  }

const TaskItem = ({isEditing, isDone, subject, onPressLabel, onRemove, onChangeSubject, onFinishEditing, simultaneousHandlers, onChangeText, id}: Props) => {

    const highlightColor = useToken(
        'colors',
        useColorModeValue('blue.500', 'blue.400')
    )
    const boxStroke = useToken(
        'colors',
        useColorModeValue('muted.300', 'muted.500')
    )

    const checkmarkColor = useToken('colors', useColorModeValue('white', 'white'))

    const activeTextColor = useToken(
        'colors',
        useColorModeValue('darkText', 'lightText')
    )
    const doneTextColor = useToken(
        'colors',
        useColorModeValue('muted.400', 'muted.600')
    )
    const handleChangeSubject = useCallback(
        (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
          onChangeSubject && onChangeSubject(id, e.nativeEvent.text)
        },
        [onChangeSubject]
    )

    const handleRemoveTask = useCallback(() => {
      onRemove && onRemove(id)
    }, [onRemove])

    return (
        <SwipableView
          simultaneousHandlers={simultaneousHandlers}
          onSwipeLeft={handleRemoveTask}
          backView={
            <Box
              w="full"
              h="full"
              bg="red.500"
              alignItems="flex-end"
              justifyContent="center"
              pr={4}
            >
              <Icon color="white" as={<Feather name="trash-2" />} size="sm" />
            </Box>
          }
        >
          <HStack
            alignItems="center"
            w="full"
            px={4}
            py={2}
            bg={useColorModeValue('warmGray.50', 'primary.900')}
          >
            <Input
                placeholder="Task"
                value={subject}
                variant="unstyled"
                fontSize={19}
                px={1}
                py={0}
                autoFocus
                blurOnSubmit
                // onChange={handleChangeSubject}
                onChange={handleChangeSubject}
                onBlur={onFinishEditing}
            />
          </HStack>
        </SwipableView>
    )
}

export default TaskItem