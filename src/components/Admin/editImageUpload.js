import React from 'react';
import ImageIcon from '@mui/icons-material/Image';

import { apiLinks } from '../../connection.config';

const EditImageUpload = (props) => {

    return(
        <React.Fragment>
            <div className="image-preview">
                <img 
                    className='image-preview-img' 
                    src={props.imageKey && (apiLinks.getImage + props.imageKey)} 
                    alt={props.musicImgName} 
                />
            </div>
            <div className='image-upload-button'>
                <div className='music-upload-space'>
                    <span className='music-image-title'>
                        <ImageIcon /> &ensp; " {props.imageKey === "" ? "Select Image" : props.imageKey} "
                    </span>

                </div>
            </div>
        </React.Fragment>
    );
};

export default EditImageUpload;