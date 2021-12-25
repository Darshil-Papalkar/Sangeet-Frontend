import React from 'react';
import { Modal, ModalBody, Spinner } from 'reactstrap';

import "./spinner-grow.css";

const SpinnerGrow = (props) => {

    return(
        <Modal 
            isOpen={true}
            autoFocus={true}
            scrollable={false}
            keyboard={false}
            contentClassName='loader-modal-class'
            backdrop='static'
            centered
            fullscreen="md"
            size='sm'
        >
            <ModalBody>
                <Spinner
                    color={props.color || "success"}
                    size={props.size || ""}
                    className='first-dot-spinner'
                    type="grow"
                >
                    Loading...
                </Spinner>
                
                <Spinner
                    color={props.color || "success"}
                    size={props.size || ""}
                    type="grow"
                    className='second-dot-spinner'
                >
                    Loading...
                </Spinner>
                    
                <Spinner
                    color={props.color || "success"}
                    size={props.size || ""}
                    className='third-dot-spinner'
                    type="grow"
                >
                    Loading...
                </Spinner>

            </ModalBody>
        </Modal>
    );
};

const SpinnerRotate = (props) => {

    return(
        <Spinner
            color={props.color || "success"}
            size={props.size || ""}
        >
            Loading...
        </Spinner>
    );

};

export default SpinnerGrow;

export {
    SpinnerRotate
};
