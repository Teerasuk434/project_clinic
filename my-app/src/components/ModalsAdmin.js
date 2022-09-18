import { useState } from "react";
import { Button, Modal  } from "react-bootstrap";


export function ConfirmModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.message}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button className="btn-success" onClick={props.onConfirm}>ตกลง</Button>
                <Button className="btn-danger" onClick={props.onClose}>ยกเลิก</Button>
            </Modal.Footer>
        </Modal>
    );
};

export function UpdateModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h6>{props.message}</h6>
            </Modal.Body>

            <Modal.Footer>
                <Button className="btn-success" onClick={props.onConfirm}>ตกลง</Button>
                <Button className="btn-danger" onClick={props.onClose}>ยกเลิก</Button>
            </Modal.Footer>
        </Modal>
    );
};