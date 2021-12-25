import React, {useRef, useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';

import TextInput from './textInput';
import NewImageUpload from './newImageUpload';
import SpinnerGrow from '../spinner/spinner-grow';
import { apiLinks } from '../../connection.config';

const AddNewModal = (props) => {
    const hiddenFileInput = useRef(null);

    const [loader, setLoader] = useState(false);
    const [name, setName] = useState('');
    const [artistImg, setArtistImg] = useState({});
    const [artistImgName, setArtistImgName] = useState('');
    const [artistImgPath, setArtistPath] = useState('/assets/images/default-music-upload-image.png');
  
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
        setArtistPath('/assets/images/default-music-upload-image.png');
    };

    const addDetail = async () => {
        try{
            setLoader(true);
            const names = name.split(',').map(nam => nam.trim());

            const formData = new FormData();
            formData.append('names', names);
            let response = {};

            if(props.id === '1'){
                formData.append('artistImg', artistImg[0]);
                response = await axios.post(apiLinks.addArtists, formData);
            }
            else if(props.id === '2'){
                response = await axios.post(apiLinks.addGenre, {
                    types: names
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else{
                response = await axios.post(apiLinks.addCategory, {
                    types: names
                }, {
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
                scrollable={false}
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
                        labelName="Add New Name/Type"
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
