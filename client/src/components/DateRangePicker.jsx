import gerarMatrizDias from '../utils/gerarMatrizDias';
import { format, addMonths, isSameDay, isBefore, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

export default function DateRangePicker({onClickX}) {
    
    const [dataAtual, setDataAtual] = useState(new Date()) 

    const [dataInicio, setDataInicio] = useState(null)
    const [dataFim, setDataFim] = useState(null)

    const mesAnterior = () => setDataAtual(prev => addMonths(prev, -1));
    const mesSeguinte = () => setDataAtual(prev => addMonths(prev, 1));

    const handleSelectDay = (date) => {
        if (!dataInicio) {
            setDataInicio(date);
            if (!dataFim) {
                setDataFim(date);
            }
        } 
        else if ((dataInicio && !dataFim) || (dataInicio && dataFim)) {
            if (isBefore(date, dataInicio)) {
                setDataInicio(date)
            } else if (isSameDay(date, dataInicio) && !isSameDay(dataFim, dataInicio)) {
                setDataInicio(dataFim)
            } else if (isSameDay(date, dataFim) && !isSameDay(dataFim, dataInicio)) {
                setDataFim(dataInicio)
            } else if (isSameDay(dataInicio, dataFim)) {
                setDataInicio(null)
                setDataFim(null)
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


    return {
        dataInicio,
        dataFim,
        ComponenteDate: (
        <div className="flex flex-col w-[720px] gap-[12px] p-[28px] font-poppins border border-[#e5e5e5] rounded-[16px] bg-white">
           <div className='w-full flex justify-end'> <button onClick={onClickX}> <X className='size-[18px] hover:cursor-pointer'/> </button> </div>
            <div className='flex'>
                
            <div className="p-[28px] bg-white">
                <div className="flex items-center justify-between mb-[12px]">
                    <button onClick={mesAnterior} className="flex items-center hover:cursor-pointer"> <ChevronLeft size="18px"/> </button>
                    <span className="font-semibold"> {format(dataAtual, 'MMMM yyyy', {locale: ptBR})} </span>
                <div/>
            </div>

                <div className="weekdays grid grid-cols-7">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day, index) => {return (<span key={index} className='flex justify-center items-center w-10 h-10'> {day} </span>)})}
                </div>

                <div className="grid grid-cols-7">
                    {diasEsquerda.map((date, index) => {
                        if (!date) return <div key={index}/>
                        return (
                            <div className={`${(isSameDay(date, dataFim))? 'bg-gray-200 rounded-r-[10px]': (isSameDay(date, dataInicio))? 'bg-gray-200 rounded-l-[10px]':''}`}>
                                <button key={index} onClick={() => handleSelectDay(date)} className={`flex justify-center items-center w-10 h-10 ${(isSelectedStart(date) || isSelectedEnd(date))? 'bg-black text-white rounded-[10px] z-1': (isInBetween(date))? 'bg-gray-200 rounded-[0px]':'hover:bg-[#e5e5e5] hover:rounded-[10px]'} hover:cursor-pointer`}>
                                    {date.getDate()}
                                </button> 
                            </div> 
                        )
                    })}
                </div>
            </div>

            <div className="p-[28px]">
                <div className="flex items-center justify-between mb-[12px]">
                    <div/>
                    <span className="font-semibold"> {format(addMonths(dataAtual, 1), 'MMMM yyyy', {locale: ptBR})} </span>
                    <button onClick={mesSeguinte} className="flex items-center hover:cursor-pointer"> <ChevronRight size="18px"/> </button>
                </div>

                <div className="weekdays grid grid-cols-7">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day, index) => {return (<span key={index} className='flex justify-center items-center w-10 h-10'> {day} </span>)})}
                </div>

                <div className="grid grid-cols-7">
                    {diasDireita.map((date, index) => {
                        if (!date) return <div key={index}/>
                        return (
                            <div className={`${(isSameDay(date, dataFim) && dataInicio && !isSameDay(dataInicio, dataFim))? 'bg-gray-200 rounded-r-[10px]': (isSameDay(date, dataInicio) && dataFim && !isSameDay(dataInicio, dataFim))? 'bg-gray-200 rounded-l-[10px]':''}`}>
                                <button key={index} onClick={() => handleSelectDay(date)} className={`flex justify-center items-center w-10 h-10 ${(isSelectedStart(date) || isSelectedEnd(date))? 'bg-black text-white rounded-[10px] z-1': (isInBetween(date))? 'bg-gray-200 rounded-[0px]':'hover:bg-[#e5e5e5] hover:rounded-[10px]'} hover:cursor-pointer`}>
                                    {date.getDate()}
                                </button> 
                            </div>
                        )
                    })}
                </div>
                </div>
            </div>

        </div>
    )}
}