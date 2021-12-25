import React, {useState} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col} from 'reactstrap';

import TextInput from './textInput';
import AddNewModal from './addNewModal';
import CheckBoxInput from './checkBoxInput';
import NewImageUpload from './newImageUpload';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
    style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
    },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const NewMusicAdd = (props) => {

    const [addGenreWidget, setAddGenreWidget] = useState(false);
    const [addArtistWidget, setAddArtistWidget] = useState(false);
    const [addCategoryWidget, setAddCategoryWidget] = useState(false);

    const {genre, category, musicName, artist, musicImgPath, musicImgName, addMusicWidget, hiddenFileInput,
        hiddenMusicInput, uploadMusic, handleClick, handleChange, saveUploadMusic, handleMusicClick,
        uploadMusicImage, handleGenreChange, removeMusicDetails, removeSelectedSong, removeSelectedImage,
        updateAddMusicWidget, handleCategoryChange, musicTitle, albumTitle, setMusicTitle, setAlbumTitle} = props;

    const onButtonClick = (event) => {
        const id = event.target.id;
        switch(id){
            case 'add-1': 
                setAddArtistWidget(prev => !prev);
                break;
            case 'add-2':
                setAddGenreWidget(prev => !prev);
                break;
            case 'add-3':
                setAddCategoryWidget(prev => !prev);
                break;
            default:
                setAddGenreWidget(false);
                setAddArtistWidget(false);
                setAddCategoryWidget(false);
                break;
        }
    };

    return (
        <React.Fragment>
            
            <Modal
                isOpen={addMusicWidget}
                centered={true}
                scrollable={true}
                backdrop
                size='xl'
                toggle={updateAddMusicWidget}
            >
                <ModalHeader toggle={updateAddMusicWidget}>
                    <span className='modal-header-title'>
                        Add New Song
                    </span>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="6">
                            <div className='music-details'>
                                

                                <TextInput 
                                    required
                                    id="song-name"
                                    labelName="Song Name"
                                    label="Enter Song Name"
                                    value={musicTitle}
                                    onChange={setMusicTitle}
                                />
                                <TextInput 
                                    id="album-name"
                                    labelName="Album Name"
                                    label="Enter Album Name"
                                    value={albumTitle}
                                    onChange={setAlbumTitle}
                                />

                                <CheckBoxInput 
                                    id="artist-name" labelName="Artist Name"
                                    label="Select Artist" type={artist}
                                    handleChange={handleChange} MenuProps={MenuProps}
                                    names={names}
                                />
                                <CheckBoxInput 
                                    id="genre-name" labelName="Genre Name"
                                    label="Select Genre" type={genre}
                                    handleChange={handleGenreChange} MenuProps={MenuProps}
                                    names={names}
                                />
                                <CheckBoxInput 
                                    id="category-name" labelName="Category Name"
                                    label="Select Category" type={category}
                                    handleChange={handleCategoryChange} MenuProps={MenuProps}
                                    names={names}
                                />

                                <Row className='music-detail-fields'>
                                    <Col xs="4" className='mt-2 mb-3' style={{textAlign: "center"}}>
                                        <Button id="add-1" color='dark' onClick={onButtonClick}>
                                            Add Artists
                                        </Button>
                                    </Col>
                                    <Col xs="4" className='mt-2 mb-3' style={{textAlign: "center"}}>
                                        <Button id="add-2" color="dark" onClick={onButtonClick}>
                                            Add Genre
                                        </Button>
                                    </Col>
                                    <Col xs="4" className='mt-2 mb-3' style={{textAlign: "center"}}>
                                        <Button id="add-3" color="dark" onClick={onButtonClick}>
                                            Add Category
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg="6">

                            <Row>
                                <div className='music-upload-button'>
                                    <div className='music-upload-detail'>
                                        <span className='music-image-title' style={{textAlign: "center"}}>
                                            " {musicName.trim().length === 0 ? "Select File" : musicName} "
                                        </span>
                                        {musicName.trim().length === 0 ? 
                                            <React.Fragment /> : 
                                            <Button close title='Remove song' onClick={removeSelectedSong}/>
                                        }
                                    </div>
                                    <div className='music-upload-detail'>
                                        <input 
                                            type="file" 
                                            accept='audio/*'
                                            onChange={uploadMusic} 
                                            ref={hiddenMusicInput}
                                            style={{display: "none"}}
                                        />
                                        <Button 
                                            onClick={handleMusicClick}
                                            color='dark'
                                            outline={true}
                                        >
                                            Upload Song
                                        </Button>
                                    </div>
                                </div>
                            </Row>

                            <NewImageUpload 
                                musicImgName={musicImgName}
                                musicImgPath={musicImgPath}
                                removeSelectedImage={removeSelectedImage}
                                uploadMusicImage={uploadMusicImage}
                                hiddenFileInput={hiddenFileInput}
                                handleClick={handleClick}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={saveUploadMusic}
                    >
                        Save
                    </Button>
                    <Button onClick={removeMusicDetails}>
                        Discard
                    </Button>
                </ModalFooter>
            </Modal>

            {addArtistWidget ? 
                <AddNewModal 
                    header="Add New Artist"
                    toggle={setAddArtistWidget}
                    id='1'
                /> :
                <React.Fragment />
            }
            
            {addGenreWidget ? 
                <AddNewModal 
                    header="Add New Genre"
                    toggle={setAddGenreWidget}
                    id='2'
                /> :
                <React.Fragment />
            }
            
            {addCategoryWidget ? 
                <AddNewModal 
                    header="Add New Category"
                    toggle={setAddCategoryWidget}
                    id='3'
                /> :
                <React.Fragment />
            }
        </React.Fragment>
    );
};

export default NewMusicAdd;
