
const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:dev_setups')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();
    // const publicIds = resources.map((file) => file.public_id);
    res.send(resources);
});
app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const clientId = req.body.clientId;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
            folder: `client/${clientId}`,
            use_filename: true,
            unique_filename: false
        });
        console.log(uploadResponse);
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});
/// créé le dossier clien avec id 
// ensuite j'upload avec un autre dossier dans ce dossier avec id de la librairie créé 
// ensuite je copie les liens vers la librairie beyable
// redimensionnement 
app.post('/api/create', async (req, res) => {
    const clientId = req.body.clientId;
    try {
        cloudinary.api.create_folder(
            `client/${clientId}`,
            function (error, result) {
                console.log(result);
                res.json({ msg: result });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }

});
// get presets
app.get('/api/presets', async (req, res) => {
    const resources = await cloudinary.api.root_folders((err, result) => {
        res.json(result)
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});