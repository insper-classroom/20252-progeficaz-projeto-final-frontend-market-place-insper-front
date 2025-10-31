import { useState } from "react";

export function ProfilePhotoUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "preset_name_aqui");

    const response = await fetch("https://api.cloudinary.com/v1_1/<cloud_name>/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setUploadedUrl(data.secure_url);

    // opcional: enviar essa URL para o backend Flask para salvar no perfil do usuário
    await fetch("http://localhost:5000/users/profile-photo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: data.secure_url }),
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="cursor-pointer">
        <input type="file" accept="image/*" onChange={handleFileChange} hidden />
        <div className="w-32 h-32 rounded-full overflow-hidden border">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
          ) : (
            <p className="flex items-center justify-center h-full text-gray-500">Selecionar</p>
          )}
        </div>
      </label>

      {selectedFile && (
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Upload
        </button>
      )}

      {uploadedUrl && (
        <div>
          <p className="text-green-600">Upload concluído!</p>
          <img src={uploadedUrl} alt="uploaded" className="w-32 h-32 rounded-full mt-2" />
        </div>
      )}
    </div>
  );
}



// // app/components/ui/profile-photo.tsx
// import { useEffect, useMemo, useState } from "react";

// // (Opcional) Se você tiver um AuthContext com token/usuário, ajuste o import:
// /// import { useAuth } from "../../contexts/auth.context";

// type MeResponse = {
//   id: string;
//   name: string;
//   email: string;
//   profile_photo_url?: string | null;
// };

// type Props = {
//   /** Se você já tiver a URL da foto (ex: veio no login), pode passar aqui */
//   initialImageUrl?: string | null;
//   /** Nome do upload preset do Cloudinary */
//   cloudinaryPreset: string;
//   /** Cloud name do Cloudinary */
//   cloudinaryCloudName: string;
//   /** Endpoint para salvar a URL no perfil do usuário */
//   savePhotoEndpoint?: string; // default: "/users/profile-photo"
//   /** Endpoint para buscar o usuário logado */
//   meEndpoint?: string; // default: "/users/me"
//   /** Token JWT (se você tiver no contexto, pode passar via prop). */
//   authToken?: string;
//   /** Base URL da API Flask (ex: "http://localhost:5000") */
//   apiBaseUrl?: string; // default: "http://localhost:5000"
// };

// export function ProfilePhotoUploader({
//   initialImageUrl = null,
//   cloudinaryPreset,
//   cloudinaryCloudName,
//   savePhotoEndpoint = "/users/profile-photo",
//   meEndpoint = "/users/me",
//   authToken,
//   apiBaseUrl = "http://localhost:5000",
// }: Props) {
//   const defaultImage = "/default-avatar.png";

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [currentUrl, setCurrentUrl] = useState<string | null>(initialImageUrl);

//   // // Se você tiver AuthContext, descomente:
//   // const { token, user } = useAuth();
//   // const bearer = authToken ?? token;

//   const bearer = authToken; // usando prop por padrão

//   // Busca a foto atual do usuário ao montar (se ainda não temos)
//   useEffect(() => {
//     let isMounted = true;

//     async function fetchMe() {
//       try {
//         const res = await fetch(`${apiBaseUrl}${meEndpoint}`, {
//           headers: bearer ? { Authorization: `Bearer ${bearer}` } : {},
//           credentials: "include",
//         });
//         if (!res.ok) return;
//         const data: MeResponse = await res.json();
//         if (isMounted) setCurrentUrl(data.profile_photo_url ?? null);
//       } catch {
//         // silencioso; fica no default
//       }
//     }

//     if (!initialImageUrl) {
//       fetchMe();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [apiBaseUrl, meEndpoint, bearer, initialImageUrl]);

//   // Limpa o blob URL de preview quando trocar arquivo
//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   const srcToShow = useMemo(
//     () => previewUrl || currentUrl || defaultImage,
//     [previewUrl, currentUrl]
//   );

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] ?? null;
//     setSelectedFile(file);
//     if (file) setPreviewUrl(URL.createObjectURL(file));
//     else setPreviewUrl(null);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     // 1) Upload direto para o Cloudinary
//     const cloudForm = new FormData();
//     cloudForm.append("file", selectedFile);
//     cloudForm.append("upload_preset", cloudinaryPreset);

//     const cloudRes = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
//       { method: "POST", body: cloudForm }
//     );
//     if (!cloudRes.ok) {
//       alert("Falha ao enviar para Cloudinary.");
//       return;
//     }
//     const cloud = await cloudRes.json();
//     const secureUrl: string = cloud.secure_url;

//     // 2) Salva a URL no perfil (Flask)
//     const saveRes = await fetch(`${apiBaseUrl}${savePhotoEndpoint}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
//       },
//       body: JSON.stringify({ imageUrl: secureUrl }),
//       credentials: "include",
//     });

//     if (!saveRes.ok) {
//       alert("Upload feito, mas não consegui salvar no perfil.");
//       // Ainda assim atualiza localmente
//       setCurrentUrl(secureUrl);
//       setSelectedFile(null);
//       setPreviewUrl(null);
//       return;
//     }

//     // 3) Atualiza UI
//     setCurrentUrl(secureUrl);
//     setSelectedFile(null);
//     setPreviewUrl(null);
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <label className="cursor-pointer">
//         <input type="file" accept="image/*" onChange={handleFileChange} hidden />
//         <div className="w-32 h-32 rounded-full overflow-hidden border">
//           <img
//             src={srcToShow}
//             alt="Foto de perfil"
//             className="object-cover w-full h-full"
//             referrerPolicy="no-referrer"
//           />
//         </div>
//       </label>

//       {selectedFile ? (
//         <button
//           onClick={handleUpload}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           Upload
//         </button>
//       ) : null}
//     </div>
//   );
// }
