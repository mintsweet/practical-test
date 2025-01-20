import { useState } from 'react';

import data from './data';
import { Viewer } from './Viewer';

const prefix = import.meta.env.X_STATIC;

const getOriginalImageSize = (
  imageUrl: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

function App() {
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [fileUrl, setFileUrl] = useState<string>();
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'idle' || !e.target.files) {
      return;
    }

    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const fileUrl = await fetch('/api/upload-and-extract', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => `${prefix}/${data.fileName}`);
      const size = await getOriginalImageSize(fileUrl);

      setFileUrl(fileUrl);
      setImgSize(size);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto h-screen">
      <h1 className="py-4 text-3xl font-bold">Xtracta</h1>
      {['idle', 'uploading'].includes(status) && (
        <>
          <label htmlFor="upload" className="block mt-10 w-1/2 mx-auto">
            {status === 'idle' && (
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm font-semibold text-gray-500">
                  Click to upload
                </p>
              </div>
            )}
            {status === 'uploading' && (
              <div className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
                <svg
                  className="w-12 h-12 text-gray-200 animate-spin fill-gray-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
            <input
              id="upload"
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </>
      )}
      {status === 'success' && fileUrl && imgSize && (
        <Viewer url={fileUrl} data={data} imgSize={imgSize} />
      )}
    </div>
  );
}

export default App;
