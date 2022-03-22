import React, {useState, useCallback, useEffect} from 'react'
import {
    Text, Box, VStack, useColorModeValue, Fab, Icon
} from 'native-base'
import NavBar from '../components/navbar'
import TaskItem from '../components/task-item'
import shortid from 'shortid'
import {AntDesign} from '@expo/vector-icons'
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
    let initialData = [
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
        {
            id: shortid.generate(),
            subject: '앗! 야생의 아름(이)가 나타났다!',
            done: true
        },
    ]

    const [data, setData] = useState(initialData)
    useEffect(() => {console.log('newData', data)}, [data])
    const handleChangeTaskItemSubject = useCallback((id: string, newSubject: string) => {
        const newData = [...data]
        console.log(newData, id)
        newData.map((task) => {if(task.id === id){task.subject = newSubject}})
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
            <Fab bottom={35} renderInPortal={false} shadow={2} size="sm" icon={<Icon onPress={() => {setData(prev => {
                const newData = [...prev]
                newData.push({
                    id: shortid.generate(),
                    subject: '',
                    done: false
                })
                return newData
            })}} color="white" as={AntDesign} name="plus" size="sm" />} />
        </Box>
    )
}