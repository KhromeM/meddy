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
        resolve(response);
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

export const getImage = (file, user) => {
  const token = user?.stsTokenManager?.accessToken;
  const userid = user?.uid;
  const fileName = file?.name;
  const baseUrl = "http://localhost:8000/api";
  return new Promise((resolve, reject) => {
    try {
      const response = axios.get(
        `${baseUrl}/image?image=${fileName}&userId=${userid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "idToken": token
          },
        }
      );
      debugger
      resolve(response);
    } catch (error) {
      console.error(
        "Error retriving image:",
        error.response?.data?.message || error.message
      );
      reject(error);
    }
  });
};
