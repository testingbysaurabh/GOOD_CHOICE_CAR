import React from 'react'
import { useGlobalContext } from '../utils/context/MyContext'
import { useParams } from 'react-router-dom'

const DetailView = () => {
    const { orignalData, setOrignalData } = useGlobalContext()
    const {id } = useParams()
   
    


    return (
        <div>DetailView</div>
    )
}

export default DetailView