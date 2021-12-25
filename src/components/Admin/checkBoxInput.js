import React from 'react';
import { Row, Col, Label } from 'reactstrap';
import { InputLabel, Select, OutlinedInput, MenuItem, 
        Checkbox, ListItemText, FormControl} from '@mui/material';

const CheckBoxInput = (props) => {
    
    return (
        <FormControl sx={{width: '100%'}}>
            <Row className='music-detail-fields'>
                <Col className="mt-2 mb-3" xs="5">
                    <Label className="label-styling-checkbox" 
                        for={props.id}>
                        {props.labelName}
                    </Label>
                </Col>
                <Col className="mt-2 mb-3" xs="7">
                    <InputLabel 
                        id={`demo-multiple-checkbox-label ${props.id}`}
                        className="customized-form-label"
                    >
                        {props.label}
                    </InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        className="music-input-detail"
                        value={props.type}
                        onChange={props.handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => {
                            if(selected.length === 0){
                                return <em>Select Artist</em>;
                            }
                            return selected.join(', ');
                        }}
                        MenuProps={props.MenuProps}
                    >
                    {props.names.map((name) => (
                        <MenuItem key={name} value={name}>
                        <Checkbox checked={props.type.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                    </Select>
                </Col>
            </Row>
        </FormControl>
    );
};

export default CheckBoxInput;
