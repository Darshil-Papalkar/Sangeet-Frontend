import React from 'react';
import { Button } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';

import { apiLinks } from '../../connection.config';

const EditImageUpload = (props) => {
    
    return(
        <React.Fragment>
            <div className="image-preview">
                <img 
                    className='image-preview-img' 
                    src={props.musicImgPath || (props.imageKey && (apiLinks.getImage + props.imageKey))} 
                    alt={props.artistImgName || props.musicImgName} 
                />
            </div>
            <div className='image-upload-button'>
                <div className='music-upload-space'>
                    <span className='music-image-title' style={{ flexDirection: "row" }}>
                        " {props.artistImgName !== "" ? props.artistImgName : props.imageKey} " &nbsp;&nbsp;
                        <input 
                            accept='image/*'
                            type="file" 
                            onChange={props.uploadMusicImage} 
                            ref={props.hiddenFileInput}
                            style={{display: "none"}}
                        />
                        {
                            props.musicImgName === "" ? 
                                <React.Fragment /> : 
                                <Button 
                                    onClick={props.handleClick}
                                    color='dark'
                                    outline={true}
                                    style={{
                                        padding: "2px 6px",
                                        display: "flex",
                                    }}
                                >
                                    <EditIcon title="Edit Image" />
                                </Button>
                        }
                    </span>

                </div>
            </div>
        </React.Fragment>
    );
};

export default EditImageUpload;