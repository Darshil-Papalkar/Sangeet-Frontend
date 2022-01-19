import React, {useEffect, useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';

import TextInput from './textInput';
import EditImageUpload from './editImageUpload';
import SpinnerGrow from '../spinner/spinner-grow';
import { apiLinks } from '../../connection.config';
import { Error, Success } from '../Notification/Notification';

const EditExistingModal = (props) => {

    const { editId, fav, setFav } = props;

    const [loader, setLoader] = useState(false);
    const [name, setName] = useState(props.value || '');
    const [musicImgKey, setMusicImgKey] = useState("");

    const setData = () => {

        const data = {
            id: props.editId,
            type: name,
            name: name,
            show: fav
        };
        const editedRow = props.rows.filter(item => item.id !== props.editId);
        props.setRows([data, ...editedRow]);

    };

    const addDetail = async () => {
        try{
            setLoader(true);
            const names = name;
            
            const formData = {
                'type': names,
                'name': names,
                'show': fav
            };

            let response = {};

            if(props.id === '1'){
                response = await axios.put(apiLinks.updateAdminArtist+props.editId, formData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else if(props.id === '2'){
                response = await axios.put(apiLinks.updateAdminGenre+props.editId, formData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else{
                response = await axios.put(apiLinks.updateAdminCategory+props.editId, formData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }

            if(Object.keys(response).length === 0 && response.constructor === Object){
                const error = new Error();
                error.message = "Something went wrong, could add data now";
                throw error;
            }
            else{
                if(response.data.code === 200){
                    Success(response.data.message);
                    setData();
                    
                }
                else{
                    Error(response.data.message);
                }
                props.toggle(false);
            }
        
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoader(false);
        }
    };

    const removeDetail = () => {
        props.toggle(false);
    };

    useEffect(() => {

        let imgFileController = new AbortController();

        const getImageFileKey = async () => {
            try{
                const response = await axios.get(apiLinks.getArtistImgKey+editId, {
                    signal: imgFileController.signal
                });
                if(response.data.code === 200){
                    setMusicImgKey(response.data.message.artistImgKey);
                    imgFileController = null;
                }
                else{
                    Error(response.data.message);
                }
            }
            catch(err){
                console.log("Error Occured", err.message);
                Error(err.message);
            }
        };
        
        if(props.id === '1'){
            getImageFileKey();
        }
        
        return () => imgFileController?.abort();

    }, [editId, props.id]);

    return(
        <React.Fragment>
            
            {loader ? 
                <SpinnerGrow color="success" />: 
                <React.Fragment />
            }

            <Modal
                isOpen={true}
                centered={true}
                scrollable={true}
                backdrop
                size='lg'
                toggle={() => props.toggle(false)}
            >
                <ModalHeader toggle={() => props.toggle(false)}>
                    <span className='modal-header-title'>
                        {props.header}
                    </span>
                </ModalHeader>
                <ModalBody>
                    {props.id === '1' ? 
                        <EditImageUpload 
                            imageKey = {musicImgKey}
                            musicImgName={`${name}`}
                        /> : 
                        <React.Fragment />
                    }
                    <TextInput 
                        id={props.id}
                        required
                        labelName={props.id === '1' ? "Edit Name" : "Edit Type"}
                        label={props.id === '1' ? "Enter Artist Name" : "Enter Type"}
                        value={name}
                        onChange={setName}
                        // check={true}
                        checkedValue={fav}
                        onCheckBoxChange={setFav}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={addDetail}
                    >
                        Save
                    </Button>
                    <Button onClick={removeDetail}>
                        Discard
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default EditExistingModal;
