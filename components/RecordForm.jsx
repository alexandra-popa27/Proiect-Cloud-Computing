//import React from "react";
import { useEffect } from "react";
import React, { useState } from "react";
import { useRouter } from "next/router";

const RecordForm =(props)=>{
    const router=useRouter();
    const {entry, onSubmit}=props;
    const[data,setData]=useState(entry);

    const [ingredients, setIngredients] = useState(Array.isArray(data.ingredients) ? data.ingredients.join('\n') : '');
    const [instructions, setInstructions] = useState(Array.isArray(data.instructions) ? data.instructions.join('\n') : '');
    const [tags, setTags] = useState(Array.isArray(data.tags) ? data.tags.join(', ') : '');
    const [mealType, setMealTypes] = useState(Array.isArray(data.mealType) ? data.mealType.join(', ') : '');

    const handleChange=(type,value)=>{
        setData({ ...data,[type]:value})
    }

    const handleCancel = () => {
        router.push("/main");
    }
    
    const handleIngredientsChange = (value) => {
        setIngredients(value);
        handleChange('ingredients', value.split('\n'));
    };

    const handleInstructionsChange = (value) => {
        setInstructions(value);
        handleChange('instructions', value.split('\n'));
    };

    const handleTagsChange = (value) => {
        setTags(value);
        handleChange('tags', value.split(',').map(tag => tag.trim()));
    };

    const handleMealTypesChange = (value) => {
        setMealTypes(value);
        handleChange('mealType', value.split(',').map(mealType => mealType.trim()));
    };

    return(
        <div className="max-w-md mx-auto">
            <div className="relative h-60 overflow-hidden p-4">
            <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Hub Background" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
                Share your recipe
            </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input type="text" name="floating_recipe_name" id="floating_recipe_name" value={data.name|| ''} onChange={(e) => handleChange("name", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="floating_recipe_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Recipe name</label>
            </div>
            <div className="mb-5">
                <label htmlFor="ingredients" className="block text-sm font-bold text-gray-700">
                    Ingredients
                </label>
                <textarea
                    id="ingredients"
                    name="ingredients"
                    value={ingredients}
                    onChange={(e) => handleIngredientsChange(e.target.value)}
                    rows={4}
                    className="block w-full mt-1 mb-2 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Enter ingredients (one per line)"
                />
            </div>
            <div className="mb-5">
                <label htmlFor="instructions" className="block text-sm font-bold text-gray-700">
                    Instructions
                </label>
                <textarea
                    id="instructions"
                    name="instructions"
                    value={instructions}
                    onChange={(e) => handleInstructionsChange(e.target.value)}
                    rows={4}
                    className="block w-full mt-1 mb-2 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Enter instructions (one per line)"
                />
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="floating_first_name" id="floating_prep_minutes" value={data.prepTimeMinutes|| ''} onChange={(e) => handleChange("prepTimeMinutes", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_prep_minutes" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Prepping time in minutes</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="floating_last_name" id="floating_cook_time" value={data.cookTimeMinutes|| ''} onChange={(e) => handleChange("cookTimeMinutes", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_cook_time" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cooking time in minutes</label>
                </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input type="text" name="floating_servings" id="floating_servings" value={data.servings|| ''} onChange={(e) => handleChange("servings", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="floating_servings" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Number of servings</label>
            </div>
            <div className="grid md:grid-cols-3 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="floating_difficulty" id="floating_difficulty" value={data.difficulty|| ''} onChange={(e) => handleChange("difficulty", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_difficulty" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Difficulty</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="floating_cuisine" id="floating_cuisine" value={data.cuisine|| ''} onChange={(e) => handleChange("cuisine", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_cuisine" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cuisine</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="floating_calories" id="floating_calories" value={data.caloriesPerServing|| ''} onChange={(e) => handleChange("caloriesPerServing", e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_calories" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Calories/Serving</label>
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="tags" className="block text-sm font-bold text-gray-700">
                    Tags
                </label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={tags}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="block w-full mt-1 mb-2 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Enter tags separated by commas"
                />
            </div>
            <div className="mb-5">
                <label htmlFor="mealType" className="block text-sm font-bold text-gray-700">
                    Meal Types
                </label>
                <input
                    type="text"
                    id="mealType"
                    name="mealType"
                    value={mealType}
                    onChange={(e) => handleMealTypesChange(e.target.value)}
                    className="block w-full mt-1 mb-2 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Enter meal types separated by commas"
                />
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input 
                    type="url" 
                    name="floating_image" 
                    value={data.image|| ''}
                    onChange={(e) => handleChange("image", e.target.value)}
                    id="floating_image" 
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    placeholder=" " 
                    required 
                />
                <label htmlFor="floating_prep_minutes" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Image link</label>
            </div>
            <div className="flex justify-center">
            <button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleCancel}>Cancel</button>
            <button type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={()=>onSubmit(data)}>Post recipe</button>
            </div>
        </div>
    )
}

export default RecordForm