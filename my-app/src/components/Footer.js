import './Footer.css'

export default function Footer(){

    const iframe = '<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpoonnakanpetclinic&tabs=timeline&width=370&height=100&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId" width="370" height="130" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
    
    function Iframe(props) {
        return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
      }

    return(
        <div className="Footer">
           <div className='container p-3'>
                <div className='row mx-5'>
                    <div className="col-4 left">
                        <div className="boxs">
                            <h1 className='Title'>คลินิกปุณกันฑ์สัตวแพทย์</h1>
                            <div className='Text'>
                                <p>คลินิกรักษาสัตว์หาดใหญ่</p>
                                <p>เวลาเปิดทำการ 13.00 - 19.00 น. หยุดทุกวันเสาร์</p>
                                <p>382 ถนน ปุณณกัณฑ์ เทศบาลนครหาดใหญ่ 90110</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 center">
                        <div className="boxs">
                            <h1 className='Title'>ช่องทางการติดต่อ</h1>
                            <div className='Text'>
                                <p><i className="fa-solid fa-phone me-2 fa-lg"></i>081-622-7293</p>
                                <p><i className="fa-brands fa-line me-2 fa-xl"></i>081-622-7293</p>
                                <p><i className="fa-brands fa-square-facebook me-2 fa-xl"></i>ปุณณกัณฑ์สัตวแพทย์</p>
                            </div>
                        </div>
                    </div>  

                    <div className="col-4 right">
                        <Iframe iframe={iframe} />
                    </div>  

                    <div className="col-1">

                    </div>

                </div>
           </div>
        </div>
    )
}