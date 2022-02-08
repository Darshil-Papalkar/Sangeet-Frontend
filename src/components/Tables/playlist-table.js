import axios from 'axios';
import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Delete, Edit } from "@mui/icons-material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { IsDark } from "../../App";
import { apiLinks } from '../../connection.config';
import { Error, Success } from '../Notification/Notification';
import SpinnerGrow from '../spinner/spinner-grow';

const columns = [
  { id: 'srno', label: 'Sr. No.', minWidth: 80, align: "center" },
  { id: 'playlist_name', label: 'Playlist Title', minWidth: 100, align: "left" },
  { id: 'show', label: 'Fav', maxWidth: 50, align: "center" },
];

const commands = [  {name: 'Edit Playlist Name', icon: <DriveFileRenameOutlineIcon />}, 
                    {name: 'Add / Remove Songs', icon: <ViewListIcon />}];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SimpleDialog = (props) => {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose(-1);
    };

    const handleListItemClick = (value) => {
        onClose(commands.findIndex(command => command.name === value.name));
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Select Edit Type</DialogTitle>
            <List sx={{ pt: 0 }}>
                {commands.map((command) => (
                    <ListItem button onClick={() => handleListItemClick(command)} key={command.name}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                {command.icon}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={command.name} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
};

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

const PlaylistTable = (props) => {
    const descriptionElementRef = useRef(null);

    const { setRows } = props;

    const isDark = useContext(IsDark);

    const label = {
        inputProps: {
            'aria-label': "Favourite Check"
        }
    };
    const [loader, setLoader] = useState(false);

    const rows = props.rows || [];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [open, setOpen] = useState(false);
    const [updateElement, setUpdateElement] = useState(0);

    const [openMusicList, setOpenMusicList] = useState(false);
    const [editMusicList, setEditMusicList] = useState({});
    const [existingMusicList, setExistingMusicList] = useState([]);

    const [openAddMusicList, setOpenAddMusicList] = useState(false);
    const [addMusicList, setAddMusicList] = useState([]);
    const [checked, setChecked] = useState([]);

    const handleAddMusicOpen = async () => {
        try{
            setLoader(true);
            const response = await axios.get(apiLinks.getMusicIdNameAlbum);
            if(response.data.code === 200){
                setChecked([...existingMusicList]);
                setAddMusicList(response.data.message);
            }
            else{
                setAddMusicList([]);
                Error(response.data.message);
            }
        }
        catch(err){
            console.log("Error while getting music list", err);
            setAddMusicList([]);
            Error(err.message);
        }
        finally{
            setLoader(false);
        }
        setOpenAddMusicList(true);
    };

    const handleAddMusicClose = () => {
        setAddMusicList([]);
        setChecked([]);
        setOpenAddMusicList(false);
    };

    const saveAddMusic = async () => {
        let abortController = new AbortController();
        try{
            setLoader(true);
            const songId = checked.map(item => item.id);
            const response = await axios.put(apiLinks.updatePlaylistSongs+editMusicList.id, 
                {
                    data: songId,
                }, 
                {
                    signal: abortController.signal,
                }
            );
            if(response.data.code === 200){
                abortController = null;
                Success(response.data.message);
                handleAddMusicClose();
                handleSongListClose();
            }
            else{
                Error(response.data.message);
            }
        }
        catch(err){
            console.log("An Error Occured while saving playlist data", err);
            Error(err.message);
        }
        finally{
            setLoader(false);
        }

        abortController?.abort();
    };

    const handleClickOpen = (id) => {
        setUpdateElement(id);
        setOpen(true);
    };

    const getSelectedPlaylistSongs = async (playlist) => {
        let signalAborter = new AbortController();

        try{
            setLoader(true);
            const response = await axios.get(apiLinks.getPlaylistById+playlist.id, {
                signal: signalAborter.signal
            });

            if(response.data.code === 200){
                setExistingMusicList(response.data.message);
                signalAborter = null;
            }
            else{
                Error(response.data.message);
                setExistingMusicList([]);
            }
        }
        catch(err){
            console.log("Error while fetching playlist song list", err);
            Error(err.message);
            setExistingMusicList([]);
        }
        finally{
            setLoader(false);
        }
        signalAborter?.abort();
    };

    const handleClose = (index) => {
        if(index === -1){
            setUpdateElement(0);
        }
        else if(index === 0){
            props.editPlaylist(updateElement, "playlist");
        }
        else if(index === 1){
            const list = rows.filter(row => row.id === updateElement);
            setEditMusicList(list[0]);
            getSelectedPlaylistSongs(list[0]);
            setOpenMusicList(prev => !prev);
        }
        else{
            Error("Invalid Dialog Option Selected");
        }
        setOpen(false);
    };

    const handleSongListClose = () => {
        setExistingMusicList([]);
        setOpenMusicList(false);
    };

    const handleSongListSave = async () => {
        let abortController = new AbortController();
        try{
            setLoader(true);
            const songId = existingMusicList.map(item => item.id);
            const response = await axios.put(apiLinks.updatePlaylistSongs+editMusicList.id, 
                {
                    data: songId,
                },
                {
                    signal: abortController.signal,
                }
            );
            if(response.data.code === 200){
                abortController = null;
                Success(response.data.message);
                handleSongListClose();
            }
            else{
                Error(response.data.message);
            }
        }
        catch(err){
            console.log("Error Occured while saving playlist data", err);
            Error(err.message);
        }
        finally{
            setLoader(false);
        }
        abortController?.abort();
    };

    const theme = createTheme({
        palette: {
        mode: isDark ? "dark" : "light"
        }
    });

    const handleToggle = (value) => {
        const currentIndex = checked.findIndex(check => check.id === value.id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } 
        else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const deletePlaylistSong = (item) => {
        const index = existingMusicList.findIndex(music => music.id === item.id);
        if(index === -1){
            Error("Invalid Item");
        }
        else{
            const newList = [...existingMusicList];
            newList.splice(index, 1);
            setExistingMusicList(newList);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setPage(0);
    }, [props.rows]);

    const updateFavState = async (checked, id) => {
        try{
        const response = await axios.put(apiLinks.updateAdminPlaylistFav+id, {
            state: !checked
        }, {
            headers: {
            'content-type': "application/json"
            }
        });
        if(response.data.code === 200){
            const data = props.rows.filter(row => row.id === id);
            data[0].show = !checked;
            setRows(prev => prev.filter(row => {
                if(row.id === id){
                return data;
                }
                else{
                return row;
                }
            }))
            // Success(response.data.message);
        }
        else{
            console.log("Error Occured", response.data.message);
            // Error(response.data.message);
        }
        }
        catch(err){
            console.log(err);
            Error(err.message);
        }
    };

    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

  return (
    <React.Fragment>
        
        <SimpleDialog
            open={open}
            onClose={handleClose}
        />

        <Dialog
            fullScreen
            open={openMusicList}
            onClose={handleSongListClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleSongListClose}
                        aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Add / Remove Songs
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleAddMusicOpen}>
                        Add
                    </Button>
                    <Button autoFocus color="inherit" onClick={handleSongListSave}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <List dense={false}>
                {
                    existingMusicList.length !== 0 ? 
                        existingMusicList.map(item => {
                            return (
                                <ListItem 
                                    key={item.id}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" 
                                            onClick={() => deletePlaylistSong(item)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={item.musicTitle}
                                            src={apiLinks.getImage+item.musicImageKey}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.musicTitle}
                                        secondary={item.albumTitle}
                                    />
                                </ListItem>
                            )
                        }) :
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            <span style={{ textAlign: "center", display: "block", fontSize: "1.5rem" }}>
                                'Songs are not available'
                            </span>
                        </DialogContentText>
                }
            </List>
        </Dialog>

        <Dialog
            open={openAddMusicList}
            onClose={handleAddMusicClose}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Add Songs to "{editMusicList['playlist_name']}"</DialogTitle>
            <DialogContent dividers={true}>
                    {
                        addMusicList.length !== 0 ? 
                        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {addMusicList.map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value.id}`;
                                return (
                                    <ListItem
                                        key={value.id}
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                onChange={() => handleToggle(value)}
                                                checked={checked.findIndex(music => music.id === value.id) !== -1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={value.musicTitle}
                                                src={apiLinks.getImage+value.musicImageKey}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={value.musicTitle} secondary={value.albumTitle} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List> :
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            <span style={{ textAlign: "center", display: "block" }}>
                                'Songs are not available'
                            </span>
                        </DialogContentText>
                    }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddMusicClose}>Cancel</Button>
                <Button onClick={saveAddMusic}>Save</Button>
            </DialogActions>
        </Dialog>

        {
            loader ?
            <SpinnerGrow /> :
            <React.Fragment />
        }

        <ThemeProvider theme={theme}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }} className="bg-fade">
            <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>

                    {columns.map((column) => (
                    <TableCell
                        className="admin-table-content admin-table-heading"
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                    > 
                        {column.label}
                    </TableCell>
                    ))}

                    <TableCell
                        className="admin-table-content admin-table-heading"
                        align='center'
                        key="edit"
                        style={{ maxWidth: 60 }}
                    >
                        Edit
                    </TableCell>

                    <TableCell
                        className="admin-table-content admin-table-heading"
                        align="center"
                        key="delete"
                        style={{ maxWidth: 100 }}
                    >
                        Delete
                    </TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column, idx) => {
                            let value;
                            if(column.id !== 'srno')
                                value = row[column.id];
                            return (
                            <TableCell
                                className="admin-table-content" key={idx} align={column.align}>
                                {typeof value === 'object' ? 
                                value.map((item) => {
                                    return (
                                    <div className="admin-table-array-setup">
                                        <ArrowRightIcon />
                                        {item}
                                    </div>
                                    );
                                })
                                : column.id === 'show' ? 
                                <Checkbox checked={row[column.id]} onClick={(e) => updateFavState(row[column.id], row.id)} {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                                : column.id === 'srno' ? `${((rowsPerPage*page) + (index+1))}.` : value}
                            </TableCell>
                            );
                        })}
                        <TableCell
                            className="admin-table-content" key={Math.random()} align="center" style={{ maxWidth: 60 }}>
                            <Edit className="table-edit-delete-button" onClick={() => handleClickOpen(row.id)} />
                        </TableCell>
                        <TableCell
                            className="admin-table-content" key={Math.random()} align="center" style={{ maxWidth: 100 }}>
                            <Delete className="table-edit-delete-button" onClick={() => props.toggleWarning(row.id)} />
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            className="custom-table-pagination"
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </ThemeProvider>
    </React.Fragment>
  );
}

export default PlaylistTable;
