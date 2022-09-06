import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { API_GET,API_POST } from "../../api";

import Sidebar from "./Sidebar";

export default function FormAppointment(){

    let pages = 2;

    return(
        <>
            <div className="Main">
                <div className='top row'>
                    <div className='col'>
                        สถานะ : เจ้าของคลินิก
                    </div>
                </div>

                <div className='row'>
                    <div className='p-0 col-12 col-lg-2 bg-primary'>
                        <div className='sidebar'>
                            <Sidebar pages={pages} />
                        </div>
                    </div>

                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content p-5">
                            <div className="container m-auto">
                                <h4 className="p-5 text-center">ตารางนัดหมาย</h4>

                                <div className="container">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}