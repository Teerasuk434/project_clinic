import { Button, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useParams,Link, useNavigate } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';
import { ConfirmModal,MessageModal } from '../Modal';


import Sidebar from '../Sidebar';
import Top from '../Top';

export default function FormUser() {

    let params = useParams();
    let pages = 2;
    let date = new Date().toLocaleDateString();

    let navigate = useNavigate();

    const [userId, setUserId] = useState(0);
    const [username, setUserName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password,setPassword] = useState("");
    const [role_id, setRoleId] = useState(0);
    const [role_name, setRoleName] = useState("");

    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [emp_id, setEmpId] = useState(0);

    const [checkTypeForm, setCheckTypeForm] = useState(true);

    const [validated, setValidated] = useState(false);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        fetchRoles();
        fetchEmployee();
    },[]);

    const fetchRoles = async () => {
        let json = await API_GET("roles");

        if(json.result){
            let role_temp = []

            json.data.map(item =>{
                if(item.role_id != 1){
                    role_temp.push(item);
                }
            })

            setRoles(role_temp);
        }

    }

    const fetchEmployee = async () => {
        let json = await API_GET("emp");

        if(json.result){
            setEmployees(json.data);
        }
    }

    useEffect(() => {

        if(params.user_id === "add"){
            setCheckTypeForm(true);
        }else{
            setCheckTypeForm(false);
        }

        async function fetchData(user_id) {
            let json = await API_GET("user/" + user_id);
            var data = json.data[0];
            setUserId(data.user_id);
            setUserName(data.username);
            setCurrentPassword(data.password);
            setRoleId(data.role_id);
            setRoleName(data.role_name)
        }

        if (params.user_id != "add") {
            fetchData([params.user_id]);
        }
    },[params.user_id])
    
    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
                onConfirm();
        }
        setValidated(true);
    }

    const doCreateUser = async () => {
        
        let json = await API_POST("user/add",{
            username: username,
            password: password,
            role_id: role_id,
            emp_id:emp_id
        });

        if(json.result) {
            navigate("/users", {replace: false });
        }else{
            setModalTitle("???????????????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }

    }

    const doUpdateUser = async () => {

        let update_password
        let status_password = false;

        if(password == ""){
            update_password = currentPassword;
            status_password = false;
        }else{
            update_password = password;
            status_password = true;
        }

        const json = await API_POST("user/update", {
            user_id: userId,
            username: username,
            password: update_password,
            role_id: role_id,
            status: status_password
        });


        if(json.result) {
            navigate("/users", {replace: false });
        }else{
            setModalTitle("???????????????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onConfirm = async () => {
    
        if(params.user_id === "add"){
            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
        }else{

            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
        }
        
    }

    const onClickConfirm = async () => {
        setConfirmModal(false);

        if(params.user_id === "add"){
            doCreateUser();
            
        }else{
            doUpdateUser();
            
        }
    }

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }


    return (
    <>

            <div className="container-fluid">

                <div className='row'>

                        <div className='p-0 col-12 col-lg-2 bg-primary'>
                            <div className='sidebar'>
                                <Sidebar pages={pages}/>
                            </div>
                        </div>

                        <div className='p-0 m-0 col-12 col-lg-10'>
                            <div className="content">
                                <Top />

                                <div className='shadow bg-light m-5 p-5 rounded'>

                                    {params.user_id == "add" ?
                                        <h4 className='text-center'>????????????????????????????????????????????????????????????</h4>
                                    :
                                        <h4 className='text-center'>????????????????????????????????????????????????????????????</h4>
                                    }

                                    <div className='container border-top border-secondary addData'>

                                        <Form noValidate validated={validated} onSubmit={onSave}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validateUserName">
                                                    <Form.Label>???????????????????????????????????????</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={username}
                                                        placeholder="???????????????????????????????????????"
                                                        onChange={(e) => setUserName(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        ??????????????????????????? ???????????????????????????????????????
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validatePassword">
                                                    <Form.Label>????????????????????????</Form.Label>
                                                    <Form.Control
                                                        required={checkTypeForm}
                                                        type="password"
                                                        value={password}
                                                        placeholder="????????????????????????"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        ??????????????????????????? ????????????????????????
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validateRoleType">
                                                    <Form.Label>?????????????????????????????????????????????</Form.Label>
                                                    <Form.Select
                                                        value={role_id}
                                                        onChange={(e) => setRoleId(e.target.value)}
                                                        required>
                                                        <option label="???????????????????????????????????????????????????????????????????????????"></option> 
                                                        {
                                                        roles.map(item => (
                                                            <option key={item.role_id} value={item.role_id}> 
                                                            {item.role_name} </option>
                                                        ))
                                                        }
                                                    </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            ?????????????????????????????? ?????????????????????????????????????????????
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            {role_id == 3 &&
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="validateEmployee">
                                                        <Form.Label>????????????????????????????????????</Form.Label>
                                                        <Form.Select
                                                            value={emp_id}
                                                            onChange={(e) => setEmpId(e.target.value)}
                                                            required>
                                                            <option label="???????????????????????????????????????????????????"></option> 
                                                            {
                                                            employees.map(item => (
                                                                <option key={item.emp_id} value={item.emp_id}> 
                                                                {item.emp_fname} {item.emp_lname} </option>
                                                            ))
                                                            }
                                                        </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                ?????????????????????????????? ?????????????????????
                                                            </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row> 

                                            }

                                            <Row className="mt-3">
                                                <div className="col-12 col-md-6 col-lg-6"></div>
                                                <div className="col-12 col-md-6 col-lg-6 text-end">
                                                    <Button variant="success" as="input" type="submit" value="??????????????????"/>
                                                    <Link to="/users" className="btn btn-warning ms-2">??????????????????</Link>
                                                </div>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}
            />

            <ConfirmModal 
                show={confirmModal}
                title={confirmModalTitle}
                message={confirmModalMessage}
                onConfirm={onClickConfirm}
                onClose={onClose}
            />
            
        </>
    )
}