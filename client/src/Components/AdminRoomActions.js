import React, { useState } from 'react';
import axios from 'axios';

export default function AdminRoomAction({api}) {
    const [buildingId, setBuildingId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [roomClosingTime, setRoomClosingTime] = useState("");
    const [roomMaxCapacity, setRoomMaxCapacity] = useState("");
    const [roomDeviceCount, setRoomDeviceCount] = useState("");
    const [roomDate, setRoomDate] = useState("");
    
    const [updateRoomId, setUpdateRoomId] = useState("");
    const [updateBuildingId, setUpdateBuildingId] = useState("");
    const [updateRoomName, setUpdateRoomName] = useState("");
    const [updateRoomMaxCapacity, setUpdateRoomMaxCapacity] = useState("");
    const [updateRoomDeviceCount, setUpdateRoomDeviceCount] = useState("");
    const [updateRoomClosingTime, setUpdateRoomClosingTime] = useState("");
    const [updateRoomDate, setUpdateRoomDate] = useState("");


    const [deleteRoomId, setDeleteRoomId] = useState("");
    const [deleteBuildingId, setDeleteBuildingId] = useState("");


    let handleCreate = async (e) => {
        e.preventDefault();
        api.put("/api/create_room", {
            id: buildingId,
            roomName: roomName,
            closingTime: roomClosingTime,
            maxCapacity: roomMaxCapacity,
            deviceCount: roomDeviceCount,
            date: roomDate
        }).then((res) => {
            if (res.status === 200) {
                setBuildingId("");
                setRoomName("");
                setRoomClosingTime("");
                setRoomMaxCapacity("");
                setRoomDeviceCount("");
                setRoomDate("");
                alert("created successfully");
            } else {
                alert("error")
            }
        }).catch((err) => alert(err))
    };

    let handleUpdate = async (e) => {
        e.preventDefault();
        api.put("/api/update_room", {
            id: updateBuildingId,
            roomid: updateRoomId,
            roomName: updateRoomName,
            maxCapacity: updateRoomMaxCapacity,
            deviceCount: updateRoomDeviceCount,
            closingTime: updateRoomClosingTime,
            date: updateRoomDate
        }).then((res) => {
            if (res.status === 200) {
                setUpdateBuildingId("");
                setUpdateRoomId("");
                setUpdateRoomName("");
                setUpdateRoomMaxCapacity("");
                setUpdateRoomDeviceCount("");
                setUpdateRoomClosingTime("");
                setUpdateRoomDate("");
                alert("updated successfully");
            } else {
                alert("error")
            }
        }).catch((err) => alert(err))
    };

    let handleDelete = async (e) => {
        e.preventDefault();
        api.delete("/api/delete_room", { data: {id: deleteBuildingId, roomid: deleteRoomId}}).then((res) => {
            if (res.status === 200) {
                setDeleteRoomId("");
                setDeleteBuildingId("");
                alert("deleted successfully");
            } else {
                alert("error")
            }
        }).catch((err) => alert(err))
    };

    return (
    <div className="text-center ">
        <div className='text-center text-2xl border-t p-3 '>Room Operations</div>

        <h2 className="text-xl">Create Room</h2>
        <form onSubmit={handleCreate} className="p-3">
            <input type="text" value={roomName} placeholder="Room Name" onChange={(e) => setRoomName(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={buildingId} placeholder="Room's Building ID" onChange={(e) => setBuildingId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={roomMaxCapacity} placeholder="Room Max Capacity" onChange={(e) => setRoomMaxCapacity(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={roomDeviceCount} placeholder="Room Device Count" onChange={(e) => setRoomDeviceCount(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={roomClosingTime} placeholder="Room Closing Time" onChange={(e) => setRoomClosingTime(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={roomDate} placeholder="Date of Creation" onChange={(e) => setRoomDate(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Create</button>
        </form>

        <h2 className="text-xl">Update Room</h2>
        <form onSubmit={handleUpdate} className="p-3">
            <input type="text" value={updateBuildingId} placeholder="Room's Building ID" onChange={(e) => setUpdateBuildingId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateRoomId} placeholder="Room Id" onChange={(e) => setUpdateRoomId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateRoomName} placeholder="Room Name" onChange={(e) => setUpdateRoomName(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateRoomMaxCapacity} placeholder="Room Max Capacity" onChange={(e) => setUpdateRoomMaxCapacity(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateRoomDeviceCount} placeholder="Room Device Count" onChange={(e) => setUpdateRoomDeviceCount(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateRoomClosingTime} placeholder="Room ClosingTime" onChange={(e) => setUpdateRoomClosingTime(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateRoomDate} placeholder="Room Date" onChange={(e) => setUpdateRoomDate(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Update</button>
        </form>

        <h2 className="text-xl">Delete Room</h2>
        <form onSubmit={handleDelete} className="p-3">
            <input type="text" value={deleteRoomId} placeholder="Room Id" onChange={(e) => setDeleteRoomId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={deleteBuildingId} placeholder="Room's Building Id" onChange={(e) => setDeleteBuildingId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Delete</button>
        </form>
    </div>
    );
}


