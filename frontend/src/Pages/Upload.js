import React, { useState, useEffect } from 'react';
import Alert from '../Components/Alert';

export default function Upload() {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [idClient, setidClient] = useState("gaetan");
    const [idOfLibrary, setidOfLibrary] = useState();

    const getPresets = async () => {
        try {
            const res2 = await fetch('/api/presets/gaetan');
            const data2 = await res2.json();
            console.log("data2", data2);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        getPresets();
    }, []);
    const handleFileInputChange = async (e) => {
        const files = e.target.files;
        let imgs = []
        const requests = Array.from(files).map(url => previewFile(url))
        Promise.all(requests)
            .then(responses => setPreviewSource(responses))
        setPreviewSource(imgs);
        setSelectedFile(files);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                resolve(reader.result);
            };
        })
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        console.log("selectedFile", selectedFile);
        for (const file of selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                uploadImage(reader.result);
            };
            reader.onerror = () => {
                console.error('AHHHHHHHH!!');
                setErrMsg('something went wrong!');
            };
            console.log("reader", reader);
        }
    };

    const uploadImage = async (base64EncodedImage) => {
        // console.log("base64EncodedImage", base64EncodedImage);
        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({
                    clientId: 'gaetan', data: base64EncodedImage, folderId: "test",
                    eager: [{ width: 400, height: 300, crop: "pad" },
                    { width: 260, height: 200, crop: "crop", gravity: "north" }]
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };
    return (
        <div>
            <h1 className="title">Upload an Image</h1>
            <Alert msg={errMsg} type="danger" />
            <Alert msg={successMsg} type="success" />
            <form onSubmit={handleSubmitFile} className="form">
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                    multiple="multiple"
                />
                <div style={{ display: 'flex', margin: 'auto' }}>
                    <button className="btn" type="submit">
                        Submit
                </button>
                </div>
            </form>
            {previewSource && previewSource.map((img, id) =>
                <img
                    key={id}
                    src={img}
                    alt="chosen"
                    style={{ height: '300px' }}
                />
            )
            }
        </div>
    );
}