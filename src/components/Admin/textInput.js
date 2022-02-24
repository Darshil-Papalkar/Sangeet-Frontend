import React from 'react';
import { Row, Col, Label } from 'reactstrap';
import { TextField } from '@mui/material'
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

const TextInput = (props) => {

    const label = {
        inputProps: {
            'aria-label': "Favourite Check"
        }
    };

    const onCheckedChange = (event) => {
        props.onCheckBoxChange(event.target.checked);
    };

    const onValueChange = (event) => {
        console.log(event);
        props.onChange(event.target.value);
    };

    return (
        <Row className='music-detail-fields'>
            <Col className="mt-1 mb-1" xs="5">
                <Label className="label-styling" style={{justifyContent: "flex-end"}} for={props.id}>
                    {
                        props.required ? 
                        <>
                            {props.labelName} <span style={{color: "#f00", alignSelf: "flex-start"}}>*</span>
                        </> : 
                        props.labelName
                    }
                </Label>
            </Col>
            <Col className="mt-1 mb-1" xs={props.check ? "5" : "6"}>
                <TextField 
                    value={props.value}
                    onChange={onValueChange}
                    className="music-input-detail"
                    id={`standard-required ${props.id}`}
                    label={props.label}
                    variant="standard"
                />
            </Col>
            {
                props.check ?
                <Col className='mt-1 mb-1' xs="1">
                    <Checkbox onChange={onCheckedChange} checked={props.checkedValue} {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                </Col> :
                <React.Fragment />
            }
        </Row>
    );
};

export default TextInput;
