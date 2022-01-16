import React, {useRef, useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';

import TextInput from './textInput';
import NewImageUpload from './newImageUpload';
import SpinnerGrow from '../spinner/spinner-grow';
import { apiLinks } from '../../connection.config';
import { Error, Success } from '../Notification/Notification';

const AddNewModal = (props) => {

    const hiddenFileInput = useRef(null);

    const [loader, setLoader] = useState(false);
    const [name, setName] = useState('');
    const [artistImg, setArtistImg] = useState({});
    const [artistImgName, setArtistImgName] = useState('');
    const [artistImgPath, setArtistPath] = useState('/assets/images/artist-design.png');
  
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
        
    const uploadArtistImage = (event) => {
        if(event.target.files[0]){
            setArtistImg(event.target.files);
            setArtistImgName(event.target.files[0].name);
            setArtistPath(URL.createObjectURL(event.target.files[0]));
        }
    };

    const removeSelectedImage = () => {
        setArtistImg({});
        setArtistImgName('');
        setArtistPath('/assets/images/artist-design.png');
    };

    const setData = (response) => {
        if( (props.tabId === 2 && props.id === '1') ||
            (props.tabId === 3 && props.id === '2') ||
            (props.tabId === 4 && props.id === '3')){
                // props.setRows(prevData => [...prevData, ...(response.data.rowData)]);
                if(props.tabId === 2){
                    props.artistRows.push(...(response.data.rowData));
                }
                else if(props.tabId === 3){
                    props.genreRows.push(...(response.data.rowData));
                }
                else if(props.tabId === 4){
                    props.categoryRows.push(...(response.data.rowData));
                }
                else{
                    Error("Unable to update search list by tabId");
                }
            }
        // else if(props.id === '1') props.updateTabId(2);
        // else if(props.id === '2') props.updateTabId(3);
        // else if(props.id === '3') props.updateTabId(4);
        // else props.updateTabId(1);
    };

    const addDetail = async () => {
        let controller = new AbortController();

        try{

            setLoader(true);
            const names = name.split(',').map(nam => nam.trim());
            
            const formData = new FormData();
            formData.append('names', names);
            let response = {};

            if(props.id === '1'){
                formData.append('artistImg', artistImg[0]);
                response = await axios.post(apiLinks.addArtists, formData, {
                    signal: controller.signal
                });
            }
            else if(props.id === '2'){
                response = await axios.post(apiLinks.addGenre, {
                    types: names
                }, {
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else{
                response = await axios.post(apiLinks.addCategory, {
                    types: names
                }, {
                    signal: controller.signal,
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
                    controller = null;
                    Success(response.data.message);
                    setData(response);
                }
                else{
                    Error(response.data.message);
                }
            }
        
        }
        catch(err){
            console.log(err.message, err);
        }
        finally{
            controller?.abort();
            setLoader(false);
            props.toggle(false);
        }
    };

    const removeDetail = () => {
        setName('');
        removeSelectedImage();
    };

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
                        <NewImageUpload 
                            musicImgName={artistImgName}
                            musicImgPath={artistImgPath}
                            removeSelectedImage={removeSelectedImage}
                            uploadMusicImage={uploadArtistImage}
                            hiddenFileInput={hiddenFileInput}
                            handleClick={handleClick}
                        /> : 
                        <React.Fragment />
                    }
                    <TextInput 
                        id={props.id}
                        required
                        labelName={props.id === '1' ? "Add New Name" : "Add New Type"}
                        label={props.id === '1' ? "Enter Artist Name" : "Enter Comma separated Types"}
                        value={name}
                        onChange={setName}
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

export default AddNewModal;
