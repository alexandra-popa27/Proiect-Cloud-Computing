import RecordForm from "@/components/RecordForm";
import { defaultRecordValues } from "@/utils/constants";
import { createRecord } from "@/utils/recordsFunctions";
import { useRouter } from "next/router";

const Create=()=>{
    const router=useRouter();
    const entry=defaultRecordValues;
    
    const onSubmit =async(data)=>{
        try {
            const response=await createRecord(data);
            if(response){
                alert("Recipe added!");
                router.push("/main");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return <RecordForm entry={entry} onSubmit={onSubmit}/>
}

export default Create;