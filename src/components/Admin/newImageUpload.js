import React from 'react';
import { Button } from 'reactstrap';

const NewImageUpload = (props) => {

    return(
        <React.Fragment>
            <div className="image-preview">
                <img 
                    className='image-preview-img' 
                    src={props.musicImgPath} 
                    alt={props.musicImgName} 
                />
            </div>
            <div className='image-upload-button'>
                <div className='music-upload-space d-flex justify-content-center align-items-center'>
                    <span className='music-image-title'>
                        " {props.musicImgName === "" ? "Select Image" : props.musicImgName} "
                    </span>
                    {
                        props.musicImgName === "" ? <React.Fragment /> : 
                        <Button title='Remove Image' close onClick={props.removeSelectedImage} />
                    }
                </div>
                <div className='music-upload-space'>
                    <input 
                        accept='image/*'
                        type="file" 
                        onChange={props.uploadMusicImage} 
                        ref={props.hiddenFileInput}
                        style={{display: "none"}}
                    />
                    <Button 
                        onClick={props.handleClick}
                        color='dark'
                        outline={true}
                    >
                        Upload Image
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NewImageUpload;