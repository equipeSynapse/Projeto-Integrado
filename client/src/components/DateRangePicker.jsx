import gerarMatrizDias from '../utils/gerarMatrizDias';
import { format, addMonths, isSameDay, isBefore, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

export default function DateRangePicker() {
    
    const [dataAtual, setDataAtual] = useState(new Date()) 

    const [dataInicio, setDataInicio] = useState(null)
    const [dataFim, setDataFim] = useState(null)

    const mesAnterior = () => setDataAtual(prev => addMonths(prev, -1));
    const mesSeguinte = () => setDataAtual(prev => addMonths(prev, 1));

    const handleSelectDay = (date) => {
        if (!dataInicio) {
            setDataInicio(date);
        } 
        else if ((dataInicio && !dataFim) || (dataInicio && dataFim)) {
            if (isBefore(date, dataInicio)) {
                setDataInicio(date)
            } else {
                setDataFim(date)
            }
        } 
    }

    const isSelectedStart = (date) => dataInicio && isSameDay(date, dataInicio) 
    const isSelectedEnd = (date) => dataFim && isSameDay(date, dataFim) 

    const isInBetween = (date) => {
        if (!dataInicio || !dataFim) return false;

        return isWithinInterval(date, {start: dataInicio, end: dataFim}) && !isSelectedStart(date) && !isSelectedEnd(date)
    }

    const diasEsquerda = gerarMatrizDias(dataAtual);
    const diasDireita = gerarMatrizDias(addMonths(dataAtual, 1))


    return (
        <div className="flex gap-[32px] p-[28px] font-poppins border">
            <div className="border p-[28px]">
                <div className="flex items-center justify-between">
                    <button onClick={mesAnterior} className="">&lt;</button>
                    <span className="font-semibold"> {format(dataAtual, 'MMMM yyyy', {locale: ptBR})} </span>
                    <div/>
                </div>

                <div className="weekdays grid grid-cols-7">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day) => {return (<span className='flex justify-center items-center w-10 h-10'> {day} </span>)})}
                </div>

                <div className="grid grid-cols-7">
                    {diasEsquerda.map((date) => {
                        if (!date) return <div/>
                        return (
                            <button onClick={() => handleSelectDay(date)} className={`flex justify-center items-center w-10 h-10 ${(isSelectedStart(date) || isSelectedEnd(date))? 'bg-black text-white rounded-[10px] z-1': (isInBetween(date))? 'bg-gray-200 rounded-[0px]':'hover:bg-[#e5e5e5]'} hover:cursor-pointer`}>
                                {date.getDate()}
                            </button>   
                        )
                    })}
                </div>
            </div>

            <div className="border p-[28px]">
                <div className="flex items-center justify-between">
                    <div/>
                    <span className="font-semibold"> {format(addMonths(dataAtual, 1), 'MMMM yyyy', {locale: ptBR})} </span>
                    <button onClick={mesSeguinte} className="">&gt;</button>
                </div>

                <div className="weekdays grid grid-cols-7">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day) => {return (<span className='flex justify-center items-center w-10 h-10'> {day} </span>)})}
                </div>

                <div className="grid grid-cols-7">
                    {diasDireita.map((date) => {
                        if (!date) return <div/>
                        return (
                            <button onClick={() => handleSelectDay(date)} className={`flex justify-center items-center w-10 h-10 ${(isSelectedStart(date) || isSelectedEnd(date))? 'bg-black text-white rounded-[10px] z-1': (isInBetween(date))? 'bg-gray-200 rounded-[0px]':'hover:bg-[#e5e5e5]'} hover:cursor-pointer`}>
                                {date.getDate()}
                            </button> 
                        )
                    })}
                </div>
            </div>
        </div>
    )
}