import BoxTop from "./Box-top"
import Navigation from "./Navigation"
import Footer from "./Footer"
import './Appointment.css'

export default function Appointment(){
    return (
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container appointment">
                    <p>นัดหมายบริการ</p>
                </div>

            <Footer/>
        </>
    )
}