import React, { useState } from 'react';
import axios from 'axios';

export default function AdminBuildingAction({api}) {

    const [buildingName, setBuildingName] = useState("");
    const [buildingImage, setBuildingImage] = useState("");
    
    const [updateBuildingId, setUpdateBuildingId] = useState("");
    const [updateBuildingName, setUpdateBuildingName] = useState("");
    const [updateBuildingImage, setUpdateBuildingImage] = useState("");

    const [deleteBuildingId, setDeleteBuildingId] = useState("");

    let handleCreate = async (e) => {
        e.preventDefault();
        api.post("/api/create_building", {
            name: buildingName,
            image: buildingImage
        }).then((res) => {
            if (res.status === 200) {
                setBuildingName("");
                setBuildingImage("");
                alert("created successfully");
            } else {
                alert("error")
            }
        }).catch((err) => alert(err))
    };

    let handleUpdate = async (e) => {
        e.preventDefault();
        api.put("/api/update_building", {
            id: updateBuildingId,
            name: updateBuildingName,
            image: updateBuildingImage
        }).then((res) => {
            if (res.status === 200) {
                setUpdateBuildingId("");
                setUpdateBuildingName("");
                setUpdateBuildingImage("");
                alert("updated successfully");
            } else {
                alert("error")
            }
        }).catch((err) => alert(err))
    };

    let handleDelete = async (e) => {
        e.preventDefault();
        api.delete("/api/delete_building", { data: {id: deleteBuildingId}}).then((res) => {
            if (res.status === 200) {
                setDeleteBuildingId("");
                alert("deleted successfully");
            } else {
                alert("error")
            }
        }).catch((err) => alert(err))
    };

    return (
    <div className="text-center">
        <div className='text-center text-2xl border-t p-3 '>Building Operations</div>

        <h2 className="text-xl p-8">Create Building</h2>
        <form onSubmit={handleCreate} className="p-3">
            <input type="text" value={buildingName} placeholder="Building Name" onChange={(e) => setBuildingName(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={buildingImage} placeholder="Building Image" onChange={(e) => setBuildingImage(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Create</button>
        </form>

        <h2 className="text-xl pt-6">Update Building</h2>
        <form onSubmit={handleUpdate} className="p-3">
            <input type="text" value={updateBuildingId} placeholder="Building Id" onChange={(e) => setUpdateBuildingId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateBuildingName} placeholder="Building Name" onChange={(e) => setUpdateBuildingName(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <input type="text" value={updateBuildingImage} placeholder="Building Image" onChange={(e) => setUpdateBuildingImage(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Update</button>
        </form>

        <h2 className="text-xl pt-6">Delete Building</h2>
        <form onSubmit={handleDelete} className="p-3">
            <input type="text" value={deleteBuildingId} placeholder="Building Id" onChange={(e) => setDeleteBuildingId(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Delete</button>
        </form>
    </div>
    );
}


