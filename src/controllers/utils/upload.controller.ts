import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import ApiResponse from '../../utils/ApiResponse';
import path from 'path';
import fs from 'fs';

export const upload = catchAsync(async (req, res) => {
  // Get the file that was set to our field named "image"
  const files: any = req.files;
  const { pathData } = req.body;
  const { documents } = files;
  // const savePath = `storage/${req.user.userID}/${type}`;
  const savePath = `storage/${pathData}`;
  const rootDir = path.resolve(__dirname, `../../../public/${savePath}`);

  // If no data submitted, exit
  if (!documents)
    return res.status(400).send({
      status: 'error',
      message: 'No Data',
    });

  // If does not have data mime type prevent from uploading
  // if (/^data/.test(data.mimetype))
  //   return res.status(400).send({
  //     status: "error",
  //     message: "Is not an data",
  //   });

  // Move the uploaded data to our upload folder
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }
  let documentFiles = [];
  const completeUrl = `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers.host}`;
  if (Array.isArray(documents)) {
    documentFiles = documents.map((item, index) => {
      const dir = `${rootDir}/${item.name}`.replace(/\\/g, '/');
      item.mv(dir);
      const url = `${completeUrl}/${savePath}/${item.name}`;
      // const url = dir;
      return {
        name: item.name,
        type: item.mimetype,
        size: item.size,
        lastModifiedDate: item.lastModifiedDate,
        lastModified: item.lastModified,
        content: url,
      };
    });
  } else {
    const dir = `${rootDir}/${documents.name}`.replace(/\\/g, '/');
    documents.mv(dir);
    const url = `${completeUrl}/${savePath}/${documents.name}`;
    documentFiles.push({
      name: documents.name,
      type: documents.mimetype,
      size: documents.size,
      lastModifiedDate: documents.lastModifiedDate,
      lastModified: documents.lastModified,
      content: url,
    });
  }
  ApiResponse(res, httpStatus.CREATED, 'Data Berhasil Diupload', documentFiles);
});
