
const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Get images in a client folder with id
app.get('/api/images/:clientId/:folderId', async (req, res) => {
    const clientId = req.params.clientId;
    const folderId = req.params.folderId;
    const { resources } = await cloudinary.search
        .expression(`exact folder:simplify-dev/${clientId}/${folderId}`)
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();
    res.json(resources);
});
// upload image in a client folder in folderId
app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const clientId = req.body.clientId;
        const folderId = req.body.folderId;
        const eager = req.body.eager;
        await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
            folder: `simplify-dev/${clientId}/${folderId}`,
            use_filename: true,
            unique_filename: false,
            eager: eager
        },
            function (error, result) {
                res.json(result);
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// Create a root folder for client
app.post('/api/create', async (req, res) => {
    const clientId = req.body.clientId;
    try {
        cloudinary.api.create_folder(
            `simplify-dev/${clientId}`,
            function (error, result) {
                res.json({ msg: result });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});
// get presets of folder
app.get('/api/presets/:clientId', async (req, res) => {
    const clientId = req.params.clientId;
    let dataInfos = [];
    cloudinary.api.root_folders((err, result) => {
        dataInfos.push({ account: result })
    }).then(
        cloudinary.api.sub_folders(`simplify-dev/${clientId}`, (err, result) => {
            dataInfos.push({ client: result })
            res.json(dataInfos)
        })
    );
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});