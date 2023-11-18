const { google } = require("googleapis");
const readline = require("readline");
const { OAuth2Client } = require("google-auth-library");
const credentials = require("./credentials.json");
const streamifier = require("streamifier");
const DriveLink = require("../model/drive");

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new OAuth2Client(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/drive"],
});

console.log("Authorize this app by visiting this URL:", authUrl);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  try {
    const decodedCode = decodeURIComponent(code);
    const { tokens } = await oAuth2Client.getToken(decodedCode);
    oAuth2Client.setCredentials(tokens);
    console.log("Authorization successful!");
  } catch (error) {
    console.error("Error during token exchange:", error.message);
    console.error("Error details:", error.response && error.response.data);
 
    process.exit(1);
  } finally {
    rl.close();
  }
});

const googleDriveUpload = async (req, res) => {
  const auth = oAuth2Client;
  const drive = google.drive({ version: "v3", auth });

  try {
    const files = req.files.files;


    const folderMetadata = {
      name: "Uploaded Files",
      mimeType: "application/vnd.google-apps.folder",
    };

    const createdFolder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    const folderId = createdFolder.data.id;

    for (const file of files) {
      const fileMetadata = {
        name: file.name,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: streamifier.createReadStream(file.data),
      };

      await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
    }

      const folderLink = `https://drive.google.com/drive/folders/${folderId}`;
      const driveLink = new DriveLink({ link: folderLink });
      await driveLink.save();


  
    res.status(200).json({ folderLink });
  } catch (error) {
    console.error("Error uploading files to Google Drive:", error);
   
    res.status(500).json({ error: "Failed to upload files to Google Drive." });
  }
};

module.exports = { googleDriveUpload };
