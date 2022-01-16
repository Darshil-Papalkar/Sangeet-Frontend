import React from 'react';
import { Row, Col, Label } from 'reactstrap';
import { TextField } from '@mui/material'

const TextInput = (props) => {

    const onValueChange = (event) => {
        props.onChange(event.target.value);
    }

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
            <Col className="mt-1 mb-1" xs="7">
                <TextField 
                    value={props.value}
                    onChange={onValueChange}
                    className="music-input-detail"
                    id={`standard-required ${props.id}`}
                    label={props.label}
                    variant="standard"
                />
            </Col>
        </Row>
    );
};

export default TextInput;
