import React, {useEffect, useState, useRef} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';

import TextInput from './textInput';
import EditImageUpload from './editImageUpload';
import SpinnerGrow from '../spinner/spinner-grow';
import { apiLinks } from '../../connection.config';
import { Error, Success } from '../Notification/Notification';

const EditExistingModal = (props) => {

    const hiddenFileInput = useRef(null);

    const { editId, fav, setFav } = props;

    const [loader, setLoader] = useState(false);
    const [name, setName] = useState(props.value || '');
    const [musicImgKey, setMusicImgKey] = useState("");
    
    const [artistImg, setArtistImg] = useState({});
    const [artistImgPath, setArtistPath] = useState('');
    const [artistImgName, setArtistImgName] = useState('');
  
    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const setData = () => {

        const data = {
            id: props.editId,
            type: name,
            name: name,
            show: fav,
            'playlist_name': name,
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
                'show': fav,
                'old': props.value,
            };

            let response = {};

            if(props.id === '1'){
                const formData = new FormData();
                formData.append("show", fav);
                formData.append("name", name);
                formData.append("old", props.value);
                formData.append("musicImgKey", musicImgKey);
                formData.append("artistImg", artistImg[0]);

                response = await axios.put(apiLinks.updateAdminArtist+props.editId, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
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
            else if(props.id === '3'){
                response = await axios.put(apiLinks.updateAdminCategory+props.editId, formData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            else{
                response = await axios.put(apiLinks.updateAdminPlaylist+props.editId, formData, {
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

    const uploadArtistImage = (event) => {
        if(event.target.files[0]){
            setArtistImg(event.target.files);
            setArtistImgName(event.target.files[0].name);
            setArtistPath(URL.createObjectURL(event.target.files[0]));
        }
    };

    const removeDetail = () => {
        props.toggle(false);
    };

    useEffect(() => {

        let artistImgFileController = new AbortController();
        let playlistImgFileController = new AbortController();

        const getArtistImageFileKey = async () => {
            try{
                const response = await axios.get(apiLinks.getArtistImgKey+editId, {
                    signal: artistImgFileController.signal
                });
                if(response.data.code === 200){
                    setMusicImgKey(response.data.message.artistImgKey);
                    artistImgFileController = null;
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
        
        const getPlaylistImageFileKey = async () => {
            try{
                const response = await axios.get(apiLinks.getPlaylistImgKey+editId, {
                    signal: playlistImgFileController.signal,
                });
                if(response.data.code === 200){
                    setMusicImgKey(response.data.message.image);
                    playlistImgFileController = null;
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

        if(props.id === "1"){
            getArtistImageFileKey();
        }

        if(props.id === "4"){
            getPlaylistImageFileKey();
        }
        
        return () => {
            artistImgFileController?.abort();
            playlistImgFileController?.abort();
        }

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
                    {props.id === '1' || props.id === '4' ? 
                        <EditImageUpload 
                            imageKey = {musicImgKey}
                            musicImgName={`${name}`}
                            handleClick={handleClick}
                            musicImgPath={artistImgPath}
                            artistImgName={artistImgName}
                            hiddenFileInput={hiddenFileInput}
                            uploadMusicImage={uploadArtistImage}
                        /> : 
                        <React.Fragment />
                    }
                    <TextInput 
                        id={props.id}
                        required
                        labelName={props.id === '4' ? "Edit Playlist Name" : '1' ? "Edit Name" : "Edit Type"}
                        label={props.id === '4' ? "Enter Playlist Name" : '1' ? "Enter Artist Name" : "Enter Type"}
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
