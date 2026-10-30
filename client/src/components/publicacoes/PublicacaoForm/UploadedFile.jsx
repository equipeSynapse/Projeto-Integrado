import { Trash } from "lucide-react";

export default function UploadedFile( {file, onClickTrash} ) {
    return (
    <div className='bg-white p-[24px] rounded-[8px] border-dashed border border-[#e5e5e5] flex justify-between items-center'>
        <div className='flex flex-col gap-[8px]'>
            <span className='text-[14px]'> {file.name} </span>
            <span className='text-[12px] text-[#909090]'> {file.type.split("/")[1].toUpperCase()} · {Math.round(file.size / 1024)}kb </span>
        </div>
        <div>
            <button onClick={onClickTrash} className='size-[42px] border border-[#e5e5e5] flex items-center justify-center rounded-[50px] hover:bg-[#e5e5e5]'>
                <Trash className='stroke-[#ea4335] size-[16px]' />
            </button>
        </div>
    </div>
    )
}