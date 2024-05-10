import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import { getRecordById, updateRecord } from "@/utils/recordsFunctions";
import Spinner from "@/components/Spinner";
import RecordForm from "@/components/RecordForm";
import { defaultRecordValues } from "@/utils/constants";

const Edit=()=>{
    const router=useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [entry, setEntry] = useState(defaultRecordValues);

    const handleGetRecord = async (id) => {
        try {
            const data = await getRecordById(id);
    
            if (data) {
                setEntry(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    
    };

    const onSubmit = async (data) => {
        try {
            const response = await updateRecord(data);

            if (response) {
                router.push("/");
              } else {
                alert("Failed to update record");
              }
        } catch (error) {
            console.log(error);
        }
        
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(router.asPath.split(/\?/)[1]);
        const id = searchParams.get("id");
    
        if (!id) {
          router.push("/");
        }
    
        handleGetRecord(id);
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return <RecordForm entry={entry} onSubmit={onSubmit}/>
}
export default Edit