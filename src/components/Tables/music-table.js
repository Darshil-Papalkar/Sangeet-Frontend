import axios from 'axios';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
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

import { IsDark } from "../../App";
import { apiLinks } from '../../connection.config';
import { Error } from '../Notification/Notification';

const columns = [
  { id: 'srno', label: "Sr. No.", minWidth: 80, align: "center" },
  { id: 'musicTitle', label: 'Music Name', minWidth: 170 },
  { id: 'albumTitle', label: 'Album Name', minWidth: 130 },
  { id: 'artists', label: 'Artists', minWidth: 70 },
  { id: 'genre', label: 'Genre', minWidth: 70 },
  { id: 'category', label: 'Category', minWidth: 70 },
  { id: 'show', label: 'Fav', maxWidth: 50, align: "center" },
];

export default function StickyHeadTable(props) {

  const { setRows } = props;

  const isDark = useContext(IsDark);

  const label = {
    inputProps: {
        'aria-label': "Favourite Check"
    }
  };

  const rows = props.rows || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light"
    }
  });

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
      const response = await axios.put(apiLinks.updateAdminMusicFav+id, {
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

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }} className="bg-fade">
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    className={`admin-table-content admin-table-heading ${isDark ? "dark" : "light"}`}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                  > 
                    {column.label}
                  </TableCell>
                ))}
                <TableCell
                  className={`admin-table-content admin-table-heading ${isDark ? "dark" : "light"}`}
                  align='center'
                  key="edit"
                  style={{ maxWidth: 60 }}
                >
                  Edit
                </TableCell>
                <TableCell
                  className={`admin-table-content admin-table-heading ${isDark ? "dark" : "light"}`}
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
                                  <div key={item} className="admin-table-array-setup">
                                    <ArrowRightIcon />
                                    {item}
                                  </div>
                                );
                              })
                            : column.id === 'show' ? 
                              <Checkbox checked={row[column.id]} onClick={(e) => updateFavState(row[column.id], row.id)} {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                            : column.id === "srno" ? `${((rowsPerPage*page) + (index+1))}.` : value}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        className="admin-table-content" key={Math.floor(Math.random() * 10000 + 1)} align="center" style={{ maxWidth: 60 }}>
                        <Edit className="table-edit-delete-button" onClick={() => props.editRow(row.id)} />
                      </TableCell>
                      <TableCell
                        className="admin-table-content" key={Math.floor(Math.random() * 10000 + 1)} align="center" style={{ maxWidth: 100 }}>
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
  );
}
