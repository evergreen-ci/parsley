import { useState } from "react";
import axios from "axios";

const useAxiosGet = (url: string) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  axios
    .get(url, {
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log({ progressEvent });
        console.log(percentCompleted);
        setDownloadProgress(percentCompleted);
      },
      responseType: "text",
    })
    .then(({ data: d }) => {
      setIsLoading(false);
      setData(d);
    })
    .catch((e) => {
      setIsLoading(false);
      setError(e.message);
    });

  return { data, error, isLoading, downloadProgress };
};

export default useAxiosGet;
