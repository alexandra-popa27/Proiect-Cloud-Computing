import React, { useState } from "react";
import { useRouter } from "next/router";

const ViewDetails=(props)=>{
    const router=useRouter();
    const {entry}=props;
    const[data]=useState(entry);

    const handleBack = () => {
        router.push("/main");
    }

    return(
        <div className="max-w-md mx-auto">
            <div className="relative h-60 overflow-hidden p-4">
                <img className="absolute inset-0 w-full h-full object-cover" src={data.image || ''} alt="Recipe image" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
                    {data.name || ''}
                </div>
            </div>
            <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700">Chef</label>
                <div className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300">
                    {data.chefName || "Unknown"}
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="ingredients" className="block text-sm font-bold text-gray-700">
                    Ingredients
                </label>
                <div id="ingredients" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                    {data.ingredients && data.ingredients.map((ingredient, index) => (
                        <div key={index}>{ingredient}</div>
                    ))}
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="instructions" className="block text-sm font-bold text-gray-700">
                    Instructions
                </label>
                <div id="instructions" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                    {Array.isArray(data.instructions)
                        ? data.instructions.map((instruction, index) => (
                            <div key={index}>{instruction}</div>
                        ))
                        : (data.instructions || '').split('\n').map((instruction, index) => (
                            <div key={index}>{instruction}</div>
                        ))
                    }
                </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="prepTimeMinutes" className="block text-sm font-bold text-gray-700">
                        Prepping time in minutes
                    </label>
                    <div id="prepTimeMinutes" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                        {data.prepTimeMinutes}
                    </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="cookTimeMinutes" className="block text-sm font-bold text-gray-700">
                        Cooking time in minutes
                    </label>
                    <div id="cookTimeMinutes" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                        {data.cookTimeMinutes}
                    </div>
                </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <label htmlFor="servings" className="block text-sm font-bold text-gray-700">
                    Number of servings
                </label>
                <div id="servings" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                    {data.servings}
                </div>
            </div>
            <div className="grid md:grid-cols-3 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="difficulty" className="block text-sm font-bold text-gray-700">
                        Difficulty
                    </label>
                    <div id="difficulty" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                        {data.difficulty}
                    </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="cuisine" className="block text-sm font-bold text-gray-700">
                        Cuisine
                    </label>
                    <div id="cuisine" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                        {data.cuisine}
                    </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <label htmlFor="caloriesPerServing" className="block text-sm font-bold text-gray-700">
                        Calories/Serving
                    </label>
                    <div id="caloriesPerServing" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                        {data.caloriesPerServing}
                    </div>
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="tags" className="block text-sm font-bold text-gray-700">
                    Tags
                </label>
                <div id="tags" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                    {data.tags && data.tags.map((tag, index) => (
                        <div key={index}>{tag}</div>
                    ))}
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="mealType" className="block text-sm font-bold text-gray-700">
                    Meal Types
                </label>
                <div id="mealType" className="text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600">
                    {data.mealType}
                </div>
            </div>
            <div className="flex justify-center">
                <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleBack}>
                    Go back to the recipe list
                </button>
            </div>
        </div>
    )
}

export default ViewDetails