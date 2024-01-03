import { storage } from "../config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const imageUpload = async (imageName) => {
  try {
    let uploadImage = ref(storage, `${imageName.name}`);

    let uploaded = await uploadBytes(uploadImage, imageName);

    let url = await getDownloadURL(uploadImage);

    return url;
  } catch (err) {
    console.log(err);
  }
};

export default imageUpload;
