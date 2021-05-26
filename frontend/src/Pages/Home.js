import React, { useEffect, useState } from 'react';
import { Image, Transformation } from 'cloudinary-react';

export default function Home() {
    const [imageIds, setImageIds] = useState();

    const loadImages = async () => {
        try {
            const res = await fetch('/api/images/gaetan/test')
            const data = await res.json();
            setImageIds(data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadImages();
    }, []);

    return (
        <div>
            <h1 className="title">Cloudinary Gallery</h1>
            <h1>Original</h1>
            <div className="gallery">
                {imageIds &&
                    imageIds.map((imageId, index) => (
                        <Image
                            key={index}
                            cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                            publicId={imageId.secure_url}
                            width="300"
                            crop="scale"
                        >
                        </Image>
                    ))}
                <h1>With new parameters</h1>
                {imageIds &&
                    imageIds.map((imageId, index) => (
                        <Image
                            key={index}
                            cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                            publicId={imageId.secure_url}
                            width="300"
                            crop="scale"
                        >
                            <Transformation rawTransformation="h_150,w_150,c_fill,r_20" />
                            <Transformation background="lightblue" />
                            <Transformation effect="outline:10" color="lightblue" />
                        </Image>
                    ))}
            </div>
        </div>
    );
}