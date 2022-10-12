import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import FormRegister from "./FormRegister"

export default function Register(){
    return(
        <>
            <BoxTop/>

            <div className="sticky-top">
                <Navigation />
            </div>

            <div className="container p-5" style={{background:"aliceblue"}}>
                <FormRegister/>
            </div>

            <Footer/>
        </>
    )
}