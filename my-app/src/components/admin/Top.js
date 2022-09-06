import './Admin.css'

export default function Top(){

    let date = new Date().toLocaleDateString();

    return(
        <>
            <div className='top d-flex justify-content-between px-3'>

                <div className="text">
                    <p className='me-2'>วันที่ : {date}</p>
                </div>
                <div className='text'>
                    <p> สถานะ : แอดมิน</p>
                </div>

            </div>
        </>
    )
}