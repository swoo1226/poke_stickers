import React, {useState, useCallback} from 'react'
import {
    Text, Box, VStack, useColorModeValue
} from 'native-base'
import NavBar from '../components/navbar'
import TaskItem from '../components/task-item'
import shortid from 'shortid'

export interface TaskItemData {
    id: string;
    subject: string;
    done: boolean
}
// const handleChangeTaskItemSubject = useCallback((id, newSubject) => {
//     setData(prevData => {
//         const newData = [...prevData]
//         const orgIndex = prevData.findIndex((item) => item.id === id)
//         newData[orgIndex].subject = newSubject
//         return newData
//     })
// }, [])

export default function MainScreen() {
    const initialData = [
        {
            id: shortid.generate(),
            subject: 'Buy Pokemon Bbang',
            done: false
        },
        {
            id: shortid.generate(),
            subject: '라면 사오기',
            done: false
        },
        {
            id: shortid.generate(),
            subject: '아름이 데려오기',
            done: false
        },
    ]
    console.log('initioal data is ', initialData)
    const [data, setData] = useState(initialData)

    const handleChangeTaskItemSubject = useCallback((id: string, newSubject: string) => {
        const newData = [...data]
        const currTask = newData.find((task) => task.id = id)
        currTask!.subject = newSubject
        setData(newData)
    }, [data])

    const handleRemoveTaskItem =  useCallback((id: string) => {
        setData(prevData => {
            let newData = [...prevData]
            newData = newData.filter((task) => task.id !== id)
            return newData
        })
    }, [data])

    return (
        <Box _dark={{bg: 'blueGray.900'}} _light={{bg: 'blueGray.50'}} px={5} flex={1}>
            <NavBar />
            <VStack space={5} alignItems="center">
            {data.map((task) => 
                <TaskItem key={task.id} id={task.id} isEditing={false} isDone={task.done} subject={task.subject} onChangeSubject={handleChangeTaskItemSubject} onRemove={handleRemoveTaskItem}/>
            )}
            </VStack>
        </Box>
    )
}