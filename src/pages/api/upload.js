import multiparty from 'multiparty';
import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';
import { initMongoose } from '../../libs/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import User from '../../models/User';

export default async function handle(req, res) {
    await initMongoose();
    const session = await getServerSession(req, res, authOptions);

    const s3Client = new S3({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },  
    });

    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
     if (err) {
        throw err;
     }
     const type = Object.keys(files)[0];
     const fileInfo = files[type][0];
     const filename = fileInfo.path.split('/').slice(-1)[0];
     //const filename = path.basename(fileInfo.path);

     s3Client.upload({
        Bucket: 'twitter-clone-nextjs-app',
        Body: fs.readFileSync(fileInfo.path),
        ACL: 'public-read',
        Key: `covers/${filename}`,
        ContentType: fileInfo.headers['content-type'],
     },  async (err, data) => {
        // console.log("S3 Upload Error:", err);
        // console.log("S3 Upload Success:", data);
        if (type === 'cover' || type === 'image') {
            await User.findByIdAndUpdate(session.user.id, {
                [type]: data.Location,
            }, {new : true});
        }

        fs.unlinkSync(fileInfo.path);
        res.json({files, err, data, fileInfo, src: data.Location});
     });
    });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
