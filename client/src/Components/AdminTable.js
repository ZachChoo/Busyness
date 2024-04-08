import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import api from '../Api/api';

export default function AdminTable() {
    const [building, setBuilding] = useState(null);
    const [rooms, setRooms] = useState(null);
    const timeout = 1000;
    let buildingContent = null;
    let roomsContent = null;

    function renderTable () {
        api.getAllBuildings().then(response => {
            setBuilding(response.data.data)
        })
        api.getAllRoomsInAllBuildings().then(response => {
            setRooms(response.data.data);
        })
    }
    
    useEffect(renderTable, []);

    useEffect(() => {
        const interval = setInterval(renderTable, timeout);
        return () => clearInterval(interval);
      }, []);

    if (building) {
        buildingContent = building.map((building) => (
            <TableRow
                key={building.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                {building.name}
                </TableCell>
                <TableCell align="right">{building._id}</TableCell>
                <TableCell align="right">{building.image}</TableCell>
            </TableRow>
            )
        )
    }

    if (rooms) {
        roomsContent = rooms.map((room) => (
            <TableRow
                key={room.roomName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">{room.roomName}</TableCell>
                <TableCell align="right">{room.busyness}</TableCell>
                <TableCell align="right">{room.deviceCount}</TableCell>
                <TableCell align="right">{room.maxCapacity}</TableCell>
                <TableCell align="right">{room.closingTime}</TableCell>
                <TableCell align="right">{room._id}</TableCell>
                <TableCell align="right">{room.building}</TableCell>
            </TableRow>
            )
        )
    }

    return (
    <div>
        <h1 className='text-2xl border-t p-3'>Buildings</h1>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">id</TableCell>
                <TableCell align="right">image</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {buildingContent}
            </TableBody>
            </Table>
        </TableContainer>

        <h1 className='text-2xl border-t p-3'>Rooms</h1>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Busyness</TableCell>
            <TableCell align="right">Device Count</TableCell>
            <TableCell align="right">Max Capacity</TableCell>
            <TableCell align="right">Closing Time</TableCell>
            <TableCell align="right">Room ID</TableCell>
            <TableCell align="right">Building ID</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {roomsContent}
        </TableBody>
        </Table>
        </TableContainer>
    </div>
    );
}