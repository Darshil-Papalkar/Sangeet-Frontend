import React, {useRef, useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';

import TextInput from './textInput';
import NewImageUpload from './newImageUpload';
import SpinnerGrow from '../spinner/spinner-grow';
import { apiLinks } from '../../connection.config';
import * as serviceWorker from "../../client/index";
import { Error, Success } from '../Notification/Notification';

const AddNewModal = (props) => {

    const hiddenFileInput = useRef(null);

    const [loader, setLoader] = useState(false);

    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [body, setBody] = useState('');
    const [checkBoxChecked, setCheckBoxChecked] = useState(false);

    const [artistImg, setArtistImg] = useState({});
    const [artistImgName, setArtistImgName] = useState('');
    const [artistImgPath, setArtistPath] = useState('/assets/images/artist-design.png');
  
    const handleClick = () => {
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
            (props.tabId === 4 && props.id === '3') ||
            (props.tabId === 5 && props.id === '4') ||
            (props.tabId === 6 && props.id === '5')){
                if(props.tabId === 2){
                    props.artistRows.push(...(response.data.rowData));
                }
                else if(props.tabId === 3){
                    props.genreRows.push(...(response.data.rowData));
                }
                else if(props.tabId === 4){
                    props.categoryRows.push(...(response.data.rowData));
                }
                else if(props.tabId === 5){
                    props.broadcastRows.push(...(response.data.rowData));
                }
                else if(props.tabId === 6){
                    props.playlistRows.push(...(response.data.rowData));
                }
                else{
                    Error("Unable to update search list by tabId");
                }
            }
    };

    const addDetail = async () => {
        let controller = new AbortController();

        try{

            setLoader(true);
            const names = name.split(',').map(nam => nam.trim());
            
            const formData = new FormData();
            formData.append('names', names);
            formData.append("show", checkBoxChecked);
            let response = {};

            if(props.id === '1'){
                formData.append('artistImg', artistImg[0]);
                response = await axios.post(apiLinks.addArtists, formData, {
                    signal: controller.signal
                });
            }
            else if(props.id === '2'){
                response = await axios.post(apiLinks.addGenre, {
                    types: names,
                    show: checkBoxChecked,
                }, {
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else if(props.id === "3"){
                response = await axios.post(apiLinks.addCategory, {
                    types: names,
                    show: checkBoxChecked,
                }, {
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else if(props.id === '4'){
                formData.append("url", url);
                formData.append("body", body);
                formData.append("title", name);
                formData.append('image', artistImg[0]);

                const today = new Date().toISOString();
                formData.append("today", today);
                
                response = await serviceWorker.Broadcast(formData);
            }
            else{
                formData.append("name", name);
                formData.append('image', artistImg[0]);
                response = await axios.post(apiLinks.createPlaylist, formData, {
                    signal: controller.signal
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
        setCheckBoxChecked(false);
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
                    {props.id === '1' || props.id === "4" || props.id === "5" ? 
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
                        check={props.id === "4" ? false : true}
                        labelName={props.id === "5" ? "Add New Playlist" : props.id === '4' ? "Add BroadCast Title" : 
                                    props.id === "1" ? "Add New Name" : "Add New Type"}
                        label={props.id === "5" ? "Add Playlist Name" : props.id === '4' ? "Add BroadCast Heading" : 
                                    props.id === "1" ? "Enter Artist Name" : "Enter Comma separated Types"}
                        value={name}
                        onChange={setName}
                        checkedValue={checkBoxChecked}
                        onCheckBoxChange={setCheckBoxChecked}
                    />
                    {
                        props.id === '4' ? 
                        <React.Fragment>
                            <TextInput 
                                id={props.id}
                                required
                                check={false}
                                labelName="Add Broadcast Body"
                                label="Add Broadcast Content"
                                value={body}
                                onChange={setBody}
                                checkedValue={checkBoxChecked}
                                onCheckBoxChange={setCheckBoxChecked}
                            />
                            <TextInput 
                                id={props.id}
                                required
                                check={false}
                                labelName="Add Broadcast Nav Link"
                                label="Add Relative Link"
                                value={url}
                                onChange={setUrl}
                                checkedValue={checkBoxChecked}
                                onCheckBoxChange={setCheckBoxChecked}
                            /> 
                        </React.Fragment>
                        : 
                        <React.Fragment />
                    }
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
