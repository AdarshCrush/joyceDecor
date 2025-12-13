// utils/fileToBase64.ts
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // reader.result will be a base64 string
      const base64String = reader.result as string;
      resolve(base64String);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`File reading failed: ${error}`));
    };
    
    reader.readAsDataURL(file); // This converts file to base64
  });
};