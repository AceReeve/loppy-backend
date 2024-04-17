export abstract class AbstractFileUploadService {
    abstract fileUpload(files: Files): Promise<any>; 
}
export abstract class AbstractFileUploadRepository{ 
    abstract fileUpload(files: Files): Promise<any>; 

}
interface File {
    path: string;
    filename: string;
    mimetype: string;
    created_at: string;
    file_id: any;
    extension: string;
  }
  
  export type Files = {
    image_1: File[];
    image_2: File[];
    image_3: File[];
    image_4: File[];
    image_5: File[];
  };
