import * as React from 'react';
import { useState, useEffect } from 'react';
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

const columns = [
  { id: 'srno', label: 'Sr. No.', minWidth: 80, align: "center" },
  { id: 'type', label: 'Category Type', minWidth: 100, align: "left" },
];

const CategoryTable = (props) => {

  const rows = props.rows || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
  
  return (
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
                    {/* <TableCell
                      className="admin-table-content" 
                      key={index}
                      align="center"
                      style={{ minWidth: 100 }}
                    >
                      {(rowsPerPage*page) + (index+1)}.
                    </TableCell> */}
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
                          : column.id === 'srno' ? `${((rowsPerPage*page) + (index+1))}.` : value}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      className="admin-table-content" key={Math.random()} align="center" style={{ maxWidth: 60 }}>
                      <Edit className="table-edit-delete-button" onClick={() => props.editCategory(row.id, 'category')} />
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
  );
}

export default CategoryTable;
