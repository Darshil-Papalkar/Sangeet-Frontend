import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import DoneIcon from '@mui/icons-material/Done';

export const DeleteWarning = (props) => {

    return (
        <Modal 
            centered={true}
            scrollable={false}
            backdrop
            isOpen={true}
            toggle={() => props.toggle()}
        >   
            <ModalHeader 
                toggle={() => props.toggle()}
            >
                Warning
            </ModalHeader>
            <ModalBody>
                Are you sure to delete "{props.musicTitle}" ?
            </ModalBody>
            <ModalFooter>
                <Button
                    outline
                    onClick={() => props.deleteRow()}
                    color="success"
                >
                    <div className="d-flex justify-content-center align-items-center">
                        Confirm <DoneIcon /> 
                    </div>
                </Button>
            </ModalFooter>
        </Modal>
    );
};