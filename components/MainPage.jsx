import React,{useEffect,useState} from "react";
import { deleteRecord, getRecords } from "@/utils/recordsFunctions";
import Spinner from "./Spinner";
import { useRouter } from "next/router";


const MainPage=()=>{
    const [data,setData]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const router=useRouter();

    const fetchRecords = async () => {
        try {
          const response = await getRecords();
          setData(response);
          setIsLoading(false);
    
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
    };

    const handleDeleteRecord = async (id) => {
        try {
          const response = await deleteRecord(id);
    
          if (response.deletedCount === 1) {
            const newData = data.filter((record) => record._id !== id);
            setData(newData);
          }
        } catch (error) {
          console.log(error)
        }
    };

    const handleEditRecord = (id) => {
        router.push(`/edit?id=${id}`);
    };

    const handleCreateNewRecipe = () => {
        router.push("/create");
    };

    const handleViewRecipe = (id) => {
        router.push(`/view?id=${id}`);
    };

    useEffect(()=>{
        fetchRecords();
    },[]);

    if(isLoading){
        return <Spinner/>;
    }

    return(
        <div className="relative bg-beige p-4">
            {/* Image with text overlay */}
            <div className="relative h-96 overflow-hidden p-4">
            <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Hub Background" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
                The Cooking Hub
            </div>
            </div>

            <div className="p-4 flex flex-wrap justify-center">
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={handleCreateNewRecipe}>
                    Found a new recipe? Share it with us!
                </button>
            </div>

            {/*Cards*/}
            <div className="p-4 flex flex-wrap justify-center gap-4">
                {data?.map(record => (
                    <div key={record._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <img className="rounded-t-lg" src={record.image} alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{record.name}</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                {`${record.cuisine} cuisine`}
                                <br />
                                Difficulty: {record.difficulty}
                            </p>
                            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-4" onClick={() => handleViewRecipe(record._id)}>
                                Read more
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                </svg>
                            </a>
                            <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 mr-4" onClick={() => handleEditRecord(record._id)}>Update</button>
                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => handleDeleteRecord(record._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MainPage;