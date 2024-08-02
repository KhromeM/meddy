import axios from "axios";

export const uploadImage = async (file, user) => {
  const token = user?.stsTokenManager?.accessToken;
  const userid = user?.uid;
  const baseUrl = "http://localhost:8000/api";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result.split(",")[1];
      const payload = {
        image: {
          name: file.name,
          data: base64data,
        },
        idToken: token,
      };

      try {
        const response = await axios.post(
          `${baseUrl}/image?userId=${userid}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response, "response Img upload");

        const imageName = response;
        resolve(imageName);
      } catch (error) {
        console.error(
          "Error uploading image:",
          error.response?.data?.message || error.message
        );
        reject(error);
      }
    };
  });
};
