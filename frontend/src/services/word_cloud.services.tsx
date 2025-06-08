import { httpErrorReturn } from "@/utils/http";
import { httpMultFormData } from "./http";

interface IWordCloudResponse{
    status: number;
    message: string;
    data?: IWordCloudDataResponse[];
    year_data?: { year: string; count: number }[];
}

interface IWordCloudDataResponse{
    text: string;
    value: number;
}

interface IGetWordCloudInfoRequest{
    items: {
        file: File;
        source: string;
    }[];
    quantity?: number;
}

class WordCloudServices{
    createFormData(request : IGetWordCloudInfoRequest){
        
        const formData = new FormData();

        request.items.forEach((item, index) => {    
            formData.append("files", item.file);
            formData.append('sources', item.source);

        })

        if(request?.quantity) formData.append("quantity", request.quantity.toString()); 

        return formData;
    }

    async getWordCloudData(request: IGetWordCloudInfoRequest): Promise<IWordCloudResponse> {
         try{
            const formData = this.createFormData(request);   
            
            const { data } = await httpMultFormData.post<IWordCloudResponse | undefined>(`/upload_file`, formData);
            
            console.log("WordCloud Data: ", data);
            return {
                year_data: data?.year_data,
                data: data?.data,
                status: 200,
                message: "Podcast criado com sucesso",
            }
        }catch{  
            return httpErrorReturn(500, 'Não foi possível criar o podcast', undefined);
        }
    }
}

const wordCloudServices = new WordCloudServices();
export default wordCloudServices